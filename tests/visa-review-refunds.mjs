import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';

const currentTime = Date.parse('2026-11-18T10:00:00.000Z');
const twoHours = 2 * 60 * 60 * 1000;
const caseId = '5dd0cfe7-b73f-4bce-8446-24c1fd867bff';
const origin = 'https://review.koreavisalaw.com';

class FixedDate extends Date {
  constructor(value = currentTime) { super(value); }
  static now() { return currentTime; }
}

class ReviewError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

function load(file, imports = {}) {
  const {outputText} = ts.transpileModule(readFileSync(new URL('../' + file, import.meta.url), 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
  });
  const exports = {};
  runInNewContext(outputText, {
    exports, require: name => imports[name], Date: FixedDate,
    process: {env: {}}, URL,
  });
  return exports;
}

const terms = load('lib/visa-review-terms.ts');

function harness(overrides = {}) {
  const paidAt = new Date(currentTime - twoHours).toISOString();
  let current = {
    id: caseId, name: 'Sample Applicant', email: 'sample@example.invalid', language: 'ko',
    plan: 'question', amount_cents: 5500, status: 'in_review', result: null,
    payment_order_id: 'order', payment_capture_id: 'capture', payment_environment: 'sandbox',
    paid_at: paidAt, started_at: new Date(currentTime - twoHours + 60000).toISOString(),
    updated_at: new Date(currentTime - 100000).toISOString(),
    payment_consent: {
      version: terms.paymentTermsVersion, language: 'ko',
      accepted_at: new Date(currentTime - twoHours - 60000).toISOString(),
      terms: terms.paymentTermsSnapshot('ko'),
    },
    ...overrides,
  };
  const calls = [];
  const notices = [];
  const server = {
    ReviewError, reviewPlans: {question: {amountCents: 5500}}, reviewPaymentEnvironment: () => 'sandbox',
    reviewText: (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '',
    reviewCaseId: value => value,
    loadReviewCase: async () => structuredClone(current),
    changeReviewCase: async (_previous, changes) => {
      current = {...current, ...changes, updated_at: new Date(currentTime).toISOString()};
      return structuredClone(current);
    },
    transitionReviewCase: async (_previous, changes) => {
      current = {...current, ...changes, updated_at: new Date(currentTime).toISOString()};
      return structuredClone(current);
    },
    notifyReview: async (_c, event) => {notices.push(event);},
    verifyReviewOrigin: request => {
      if (request.headers.get('origin') !== origin) throw new ReviewError('Invalid origin', 403);
    },
    reviewJson: (body, status = 200) => Response.json(body, {status}),
    reviewFailure: error => Response.json({error: error.message}, {status: error.status ?? 500}),
  };
  const workflow = load('lib/visa-review-workflow.ts', {
    'server-only': {}, './visa-review-terms': terms,
    './visa-review-server': server,
    './visa-review-paypal': {
      reviewPaymentReady: () => true,
      refundReviewPayPalCapture: async input => {
        calls.push(input);
        return {refundId: 'full-refund', status: 'COMPLETED'};
      },
    },
  });
  const route = load('app/api/visa-review/admin/route.ts', {
    '@/lib/visa-review-server': server, '@/lib/visa-review-workflow': workflow,
    '@/lib/visa-review-terms': terms,
    '@/lib/airport-server': {
      admin: async request => {
        if (request.headers.get('authorization') !== 'Bearer office-admin') throw new Error('Not authorized');
        return {id: 'office-admin'};
      },
    },
  });
  return {
    calls, notices, snapshot: () => structuredClone(current),
    refund: () => workflow.refundCase(structuredClone(current)),
    post: (action, fields = {}, authorization = 'Bearer office-admin', requestOrigin = origin) => route.POST(new Request(origin + '/api/visa-review/admin', {
      method: 'POST', headers: {origin: requestOrigin, 'content-type': 'application/json', ...(authorization ? {authorization} : {})},
      body: JSON.stringify({caseId, action, result: '서면 검토 결과의 충분한 내용입니다. 다음 절차와 확인할 자료를 안내합니다.', ...fields}),
    })),
  };
}

test('delivery is blocked one millisecond before two hours and allowed exactly at two hours', async () => {
  const early = harness({paid_at: new Date(currentTime - twoHours + 1).toISOString()});
  assert.equal((await early.post('deliver')).status, 409);
  assert.equal(early.snapshot().status, 'in_review');
  assert.equal(early.snapshot().result, null);
  assert.deepEqual(early.notices, []);

  const exact = harness();
  assert.equal((await exact.post('deliver')).status, 200);
  assert.equal(exact.snapshot().status, 'delivered');
  assert.deepEqual(exact.notices, ['delivered']);
});

test('delivery requires an actual valid payment timestamp', async () => {
  for (const paid_at of [null, '', 'not-a-date', new Date(currentTime + 60000).toISOString()]) {
    const h = harness({paid_at});
    assert.equal((await h.post('deliver')).status, 409);
    assert.equal(h.snapshot().result, null);
  }
});

test('delivery requires an authorized office administrator and same-origin request', async () => {
  const h = harness();
  assert.equal((await h.post('deliver', {}, null)).status, 401);
  assert.equal((await h.post('deliver', {}, 'Bearer somebody-else')).status, 403);
  assert.equal((await h.post('deliver', {}, 'Bearer office-admin', 'https://untrusted.invalid')).status, 403);
  assert.equal(h.snapshot().status, 'in_review');
});

test('payment alone does not permit delivery before the review is started', async () => {
  const h = harness({status: 'paid', started_at: null});
  assert.equal((await h.post('deliver')).status, 409);
});

test('full refunds remain available before two hours and after a legacy early delivery', async () => {
  for (const status of ['in_review', 'delivered']) {
    const h = harness({status, paid_at: new Date(currentTime - 60000).toISOString()});
    assert.equal((await h.post('refund')).status, 200);
    assert.equal(h.snapshot().status, 'refunded');
    assert.equal(h.calls[0].amountCents, 5500);
    assert.equal(Object.hasOwn(h.calls[0], 'refundAmountCents'), false);
  }
});

test('obsolete partial-refund API requests are rejected without issuing a payment', async () => {
  const h = harness();
  assert.equal((await h.post('refund', {refundAmountCents: 1000})).status, 422);
  assert.equal(h.calls.length, 0);
  assert.equal(h.snapshot().status, 'in_review');
});

test('a qualifying refund refusal resumes the review and preserves result delivery', async () => {
  const requestedAt = new Date(currentTime).toISOString();
  const h = harness({status: 'refund_requested', refund_requested_at: requestedAt});
  const reason = '실제 착수 내용과 적용 약관 및 법정 환불 사유를 검토한 처리 결과입니다.';
  assert.equal((await h.post('decline-refund', {reason, refundRequestedAt: requestedAt})).status, 200);
  assert.equal(h.snapshot().status, 'in_review');
  assert.equal(h.snapshot().refund_resolution_reason, reason);
  assert.equal((await h.post('deliver')).status, 200);
  assert.equal(h.snapshot().status, 'delivered');
});

test('a request within two hours cannot be rejected using the two-hour restriction', async () => {
  const requestedAt = new Date(currentTime - 1).toISOString();
  const h = harness({status: 'refund_requested', refund_requested_at: requestedAt});
  assert.equal((await h.post('decline-refund', {reason: 'Review started', refundRequestedAt: requestedAt})).status, 409);
  assert.equal(h.snapshot().status, 'refund_requested');
});

test('old in-flight full refunds keep their saved provider identifier', async () => {
  const h = harness({status: 'refunding', refund_id: 'earlier-full-refund'});
  assert.equal((await h.refund()).status, 'refunded');
  assert.equal(h.calls[0].refundId, 'earlier-full-refund');
  assert.equal(h.calls[0].amountCents, 5500);
});

test('archived refund operations require reconciliation before a new full payout', async () => {
  const h = harness({refund_operations: [{id: 'earlier-operation', amount_cents: 1000, status: 'completed'}]});
  await assert.rejects(h.refund(), {status: 409});
  assert.equal(h.calls.length, 0);
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

function load(file, imports = {}) {
  const source = readFileSync(new URL('../' + file, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  runInNewContext(outputText, { exports, require: name => imports[name], URL, process: { env: { VISA_REVIEW_OPEN: 'true' } } });
  return exports;
}

const terms = load('lib/visa-review-terms.ts');
const origin = 'https://review.koreavisalaw.com';
const request = new Request(origin + '/api/visa-review');
const plans = { question: { amountCents: 5500 }, documents: { amountCents: 9900 }, strategy: { amountCents: 33000 } };
const consent = {
  language: 'ko', termsVersion: terms.paymentTermsVersion,
  koreanLaw: true, immediateReviewAndRefund: true, noVisaGuarantee: true,
};

class ReviewError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

function checkoutHarness(plan, changes = {}) {
  let item = {
    id: 'sample-case', plan, amount_cents: plans[plan].amountCents, status: 'accepted', language: 'ko',
    accepted_at: new Date(Date.now() - 120000).toISOString(),
    updated_at: new Date(Date.now() - 120000).toISOString(),
    checkout_expires_at: new Date(Date.now() + 3600000).toISOString(),
    ...changes,
  };
  const events = [];
  const save = async (_c, patch) => (item = { ...item, ...patch });
  const workflow = load('lib/visa-review-workflow.ts', {
    'server-only': {},
    './visa-review-server': {
      ReviewError, reviewOrigin: origin, reviewPaymentEnvironment: () => 'sandbox', reviewPlans: plans,
      changeReviewCase: save, loadReviewCase: async () => item,
      transitionReviewCase: async (c, patch) => { events.push('save'); return save(c, patch); },
      notifyReview: async () => {}, sendReviewEmail: async () => {}, paymentTermsReceipt: () => '',
    },
    './visa-review-terms': terms,
    './visa-review-paypal': {
      reviewPaymentReady: () => true,
      createReviewPayPalOrder: async ({ amountCents, idempotencyKey }) => {
        events.push('create');
        assert.ok(terms.hasRecordedPaymentConsent(item.payment_consent));
        assert.equal(amountCents, changes.amount_cents ?? plans[plan].amountCents);
        assert.ok(idempotencyKey.includes(item.payment_consent.accepted_at));
        return { orderId: 'new-order', approvalUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=new-order' };
      },
      captureReviewPayPalOrder: async ({ existingOnly }) => {
        events.push(existingOnly ? 'read-existing-payment' : 'charge');
        return { captureId: 'capture-id' };
      },
    },
  });
  return {
    events,
    checkout: input => workflow.beginCheckout(item, request, input),
    capture: id => workflow.captureCase(item, id),
  };
}

test('every USD plan requires all three consents before saving and creating an order', async () => {
  for (const plan of Object.keys(plans)) {
    const { checkout, events } = checkoutHarness(plan);
    for (const field of ['koreanLaw', 'immediateReviewAndRefund', 'noVisaGuarantee']) {
      await assert.rejects(checkout({ ...consent, [field]: false }), { status: 422 });
    }
    await assert.rejects(checkout({ ...consent, termsVersion: 'old' }), { status: 422 });
    assert.deepEqual(events, []);
    await checkout(consent);
    await checkout(consent);
    assert.deepEqual(events, ['save', 'create']);
  }
});

test('an old checkout with an invalid consent record cannot initiate a charge or return its old URL', async () => {
  const { checkout, capture, events } = checkoutHarness('question', {
    status: 'checkout', payment_order_id: 'old-order', payment_approval_url: 'https://www.sandbox.paypal.com/checkoutnow?token=old-order',
    payment_environment: 'sandbox', payment_consent: { version: terms.paymentTermsVersion, language: 'ko' },
  });
  await assert.rejects(capture('old-order'), { status: 422 });
  await assert.rejects(checkout({ ...consent, noVisaGuarantee: false }), { status: 422 });
  assert.deepEqual(events, []);
  const result = await checkout(consent);
  assert.match(result.approvalUrl, /new-order$/);
  await assert.rejects(capture('old-order'), { status: 409 });
  await capture('new-order');
  assert.deepEqual(events, ['save', 'create', 'save', 'charge']);
});

test('a legacy capture retry without valid consent can only reconcile an already completed payment', async () => {
  const { capture, events } = checkoutHarness('documents', {
    status: 'capturing', payment_order_id: 'legacy-order', payment_environment: 'sandbox', payment_consent: {},
  });
  const result = await capture('legacy-order');
  assert.equal(result.payment_capture_id, 'capture-id');
  assert.deepEqual(events, ['save', 'read-existing-payment']);
});

test('an existing $50 case keeps its quoted amount and uses the same consent gate', async () => {
  const { checkout, events } = checkoutHarness('question', { amount_cents: 5000 });
  await assert.rejects(checkout({ ...consent, koreanLaw: false }), { status: 422 });
  await checkout(consent);
  assert.deepEqual(events, ['save', 'create']);
});

test('issued orders retain genuine v1 and v2 receipts after the consent wording changes', async () => {
  for (const version of ['visa-review-payment-2026-11-17-v1', 'visa-review-payment-2026-11-17-v2']) {
    const receipt = {
      version, language: 'ko', accepted_at: new Date(Date.now() - 60000).toISOString(),
      terms: terms.paymentTermsSnapshot('ko', version),
    };
    assert.equal(terms.hasRecordedPaymentConsent(receipt), true);
    assert.equal(terms.hasRecordedPaymentConsent({ ...receipt, terms: terms.paymentTermsSnapshot('ko') }), false);
    const { capture, events } = checkoutHarness('question', {
      status: 'checkout', amount_cents: 5000, payment_order_id: 'existing-order', payment_environment: 'sandbox',
      payment_consent: receipt,
    });
    await capture('existing-order');
    assert.deepEqual(events, ['save', 'charge']);
  }
});

test('intake refuses website uploads and saves only the minimum fields for a $55 case', async () => {
  const inserts = [];
  const route = load('app/api/visa-review/route.ts', {
    'node:crypto': { randomUUID: () => 'test-case' },
    '@/lib/airport-server': { db: () => ({ from: () => ({ insert: (row) => {
      inserts.push(row);
      return { select: () => ({ single: async () => ({ data: row }) }) };
    } }) }) },
    '@/lib/visa-review-server': {
      ReviewError, reviewIntakeOpen: async () => true, reviewConfigured: () => true,
      reviewPlans: plans, verifyReviewOrigin: () => {}, requireReviewEmail: () => 'customer@example.invalid',
      reviewText: value => value, reviewAgreement: () => 'test terms', publicReviewCase: () => ({}),
      notifyReview: async () => {}, reviewJson: (body, status) => Response.json(body, { status }),
      reviewFailure: error => Response.json({ error: error.message }, { status: error.status ?? 400 }),
    },
    '@/lib/visa-review-workflow': {},
  });
  const url = origin + '/api/visa-review';
  const fileRequest = new Request(url, {
    method: 'POST', headers: { 'Content-Type': 'multipart/form-data; boundary=sample' }, body: 'sample file',
  });
  assert.equal((await route.POST(fileRequest)).status, 410);
  assert.equal(fileRequest.bodyUsed, false);

  const input = { action: 'submit', plan: 'question', language: 'ko', name: 'Sample Name',
    consent: true, privacyConsent: true, transferConsent: true };
  const submit = data => route.POST(new Request(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  }));
  assert.equal((await submit({ ...input, question: 'private information', files: ['private document'] })).status, 422);
  assert.deepEqual(inserts, []);
  assert.equal((await submit(input)).status, 201);
  assert.equal(inserts[0].amount_cents, 5500);
  assert.equal(inserts[0].question, '');
  assert.equal(Object.hasOwn(inserts[0], 'files'), false);
});

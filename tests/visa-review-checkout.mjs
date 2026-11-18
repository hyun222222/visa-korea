import assert from 'node:assert/strict';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { NextRequest, NextResponse } from 'next/server.js';
import ts from 'typescript';

function load(file, imports = {}, env = {}) {
  const source = readFileSync(new URL('../' + file, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  runInNewContext(outputText, {
    exports, require: name => imports[name], Buffer, URL,
    process: { env: { VISA_REVIEW_OPEN: 'true', ...env } },
  });
  return exports;
}

const terms = load('lib/visa-review-terms.ts');
const crypto = { createHmac, randomUUID, timingSafeEqual };
const server = load('lib/visa-review-server.ts', { 'node:crypto': crypto, 'next/server': { NextResponse } }, {
  VISA_REVIEW_SESSION_SECRET: 'test-only-visa-review-signing-secret-32-bytes',
});
const direct = load('lib/visa-review-direct.ts', { 'node:crypto': crypto, './visa-review-server': server });
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

function checkoutHarness(plan, changes = {}, businessNumber = '000-00-00000') {
  let item = {
    id: 'sample-case', plan, amount_cents: plans[plan].amountCents, status: 'accepted', language: 'ko',
    accepted_at: new Date(Date.now() - 120000).toISOString(),
    updated_at: new Date(Date.now() - 120000).toISOString(),
    checkout_expires_at: new Date(Date.now() + 3600000).toISOString(),
    ...changes,
  };
  const events = [];
  const notifications = [];
  const save = async (_c, patch) => (item = { ...item, ...patch });
  const workflow = load('lib/visa-review-workflow.ts', {
    'server-only': {},
    './visa-review-server': {
      ReviewError, reviewOrigin: origin, reviewPaymentEnvironment: () => 'sandbox', reviewPlans: plans,
      reviewBusinessRegistrationNumber: () => businessNumber,
      reviewIntakeFlagOpen: server.reviewIntakeFlagOpen,
      reviewMaterialsSubmissionEnabled: () => false,
      usesPayFirstReview: server.usesPayFirstReview,
      changeReviewCase: save, loadReviewCase: async () => item,
      transitionReviewCase: async (c, patch) => { events.push('save'); return save(c, patch); },
      notifyReview: async (_c, event) => { notifications.push({ event }); },
      sendReviewEmail: async (_to, _subject, text) => { notifications.push({ text }); },
      paymentTermsReceipt: () => '',
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
    notifications,
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

test('a new checkout needs the configured business registration number', async () => {
  const { checkout, events } = checkoutHarness('question', {}, null);
  await assert.rejects(checkout(consent), { status: 503 });
  assert.deepEqual(events, []);
});

test('a new case can pay directly after consent and receives material instructions with no deadline yet', async () => {
  const directConsent = { ...consent, privacyConsent: true, transferConsent: true };
  const { checkout, capture, events, notifications } = checkoutHarness('question', {
    status: 'submitted', accepted_at: null, terms_version: server.reviewTermsVersion,
  });
  await assert.rejects(checkout({ ...directConsent, noVisaGuarantee: false }), { status: 422 });
  await assert.rejects(checkout({ ...directConsent, transferConsent: false }), { status: 422 });
  assert.deepEqual(events, []);
  await checkout(directConsent);
  await checkout(directConsent);
  const paid = await capture('new-order');
  assert.equal(paid.status, 'paid');
  assert.equal(paid.accepted_at, null);
  assert.equal(paid.deadline_at, null);
  assert.equal(paid.payment_consent.intake.agreement_version, server.reviewTermsVersion);
  assert.equal(paid.payment_consent.intake.personal_data_processing, true);
  assert.equal(paid.payment_consent.intake.overseas_transfer, true);
  assert.deepEqual(events, ['save', 'create', 'save', 'charge']);
  assert.equal(notifications[0].event, 'paid');
  assert.match(notifications[1].text, /info@kimnhyun\.com/);
  assert.match(notifications[1].text, /접수번호 sample-case/);
  assert.match(notifications[1].text, /USD 55\.00/);
  assert.match(notifications[1].text, /capture-id/);
});

test('legacy submitted cases still require office approval and approved cases retain the payment deadline', async () => {
  const submitted = checkoutHarness('question', {
    status: 'submitted', accepted_at: null, terms_version: 'visa-review-2026-11-18-v3',
  });
  await assert.rejects(submitted.checkout(consent), { status: 409 });
  assert.deepEqual(submitted.events, []);
  const accepted = checkoutHarness('question', { terms_version: 'visa-review-2026-11-18-v3' });
  await accepted.checkout(consent);
  const paid = await accepted.capture('new-order');
  assert.equal(Date.parse(paid.deadline_at) - Date.parse(paid.paid_at), 24 * 60 * 60 * 1000);
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

test('issued orders retain genuine v1, v2 and v3 receipts after the consent wording changes', async () => {
  for (const version of ['visa-review-payment-2026-11-17-v1', 'visa-review-payment-2026-11-17-v2', 'visa-review-payment-2026-11-18-v3']) {
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

function directRouteHarness({ failFirstOrder = false, open = true } = {}) {
  const cases = new Map();
  const inserts = [];
  const notifications = [];
  const providerCalls = [];
  const db = () => ({ from: () => ({ insert: (row) => {
    inserts.push(row);
    const c = { status: 'submitted', updated_at: new Date().toISOString(), ...row };
    cases.set(c.id, c);
    return { select: () => ({ single: async () => ({ data: c }) }) };
  } }) });
  async function save(c, patch) {
    const next = { ...c, ...patch };
    cases.set(c.id, next);
    return next;
  }
  const reviewServer = {
    ...server,
    loadReviewCase: async (id) => {
      const item = cases.get(id);
      if (!item) throw new server.ReviewError('Missing case', 404);
      return item;
    },
    reviewIntakeOpen: async () => open,
    reviewConfigured: () => true,
    reviewEmail: () => null,
    requireReviewEmail: () => { throw new server.ReviewError('Legacy email verification required', 401); },
    reviewPaymentEnvironment: () => 'sandbox',
    reviewBusinessRegistrationNumber: () => '000-00-00000',
    reviewMaterialsSubmissionEnabled: () => true,
    changeReviewCase: save,
    transitionReviewCase: save,
    notifyReview: async (_c, event) => { notifications.push({ event }); },
    sendReviewEmail: async (_to, _subject, text) => { notifications.push({ text }); },
  };
  const workflow = load('lib/visa-review-workflow.ts', {
    './visa-review-server': reviewServer,
    './visa-review-terms': terms,
    './visa-review-paypal': {
      reviewPaymentReady: () => true,
      createReviewPayPalOrder: async (order) => {
        providerCalls.push({ action: 'create', ...order });
        if (failFirstOrder && providerCalls.length === 1) throw new Error('Simulated provider timeout');
        return { orderId: 'new-order', approvalUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=new-order' };
      },
      captureReviewPayPalOrder: async (order) => {
        providerCalls.push({ action: 'capture', ...order });
        return { captureId: 'capture-id' };
      },
    },
  });
  const route = load('app/api/visa-review/route.ts', {
    'node:crypto': crypto,
    '@/lib/airport-server': { db },
    '@/lib/visa-review-server': reviewServer,
    '@/lib/visa-review-workflow': workflow,
    '@/lib/visa-review-direct': direct,
    '@/lib/visa-review-terms': terms,
  }, { VISA_REVIEW_PAYPAL_CLIENT_ID: 'sample-public-id', VISA_REVIEW_PAYPAL_CLIENT_SECRET: 'sample-private-secret' });
  const url = origin + '/api/visa-review';
  const post = (data, cookie = '', requestOrigin = origin) => route.POST(new NextRequest(url, {
    method: 'POST', headers: { Origin: requestOrigin, Cookie: cookie, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }));
  const get = (cookie = '') => route.GET(new NextRequest(url, { headers: { Cookie: cookie } }));
  return { cases, route, inserts, notifications, providerCalls, url, post, get };
}

function orderPayload(plan) {
  return { action: 'create-direct-order', plan, email: 'customer@example.invalid', ...consent,
    privacyConsent: true, transferConsent: true };
}

function responseCookie(response) {
  return response.headers.get('Set-Cookie')?.split(';')[0];
}

test('no-OTP checkout rejects unexpected inputs, missing consent and cross-origin requests before any write', async () => {
  const { route, inserts, notifications, providerCalls, url, post } = directRouteHarness();
  const fileRequest = new NextRequest(url, {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'multipart/form-data; boundary=sample' }, body: 'sample file',
  });
  assert.equal((await route.POST(fileRequest)).status, 410);
  assert.equal(fileRequest.bodyUsed, false);
  assert.equal((await post({ action: 'submit' })).status, 410);
  const input = orderPayload('question');
  for (const field of ['privacyConsent', 'transferConsent', 'koreanLaw', 'immediateReviewAndRefund', 'noVisaGuarantee']) {
    assert.equal((await post({ ...input, [field]: false })).status, 422);
  }
  assert.equal((await post({ ...input, termsVersion: 'expired' })).status, 422);
  assert.equal((await post({ ...input, amountCents: 1 })).status, 422);
  assert.equal((await post({ ...input, question: 'pasted private information' })).status, 422);
  assert.equal((await post(input, '', 'https://another.example')).status, 403);
  assert.deepEqual(inserts, []);
  assert.deepEqual(notifications, []);
  assert.deepEqual(providerCalls, []);
});

test('each plan creates and verifies only its fixed USD payment, then enables authenticated materials', async () => {
  for (const [plan, { amountCents }] of Object.entries(plans)) {
    const { cases, inserts, notifications, providerCalls, url, post, get } = directRouteHarness();
    const response = await post(orderPayload(plan));
    assert.equal(response.status, 200);
    const pending = await response.json();
    const cookie = responseCookie(response);
    assert.match(response.headers.get('Set-Cookie'), /HttpOnly/);
    assert.match(response.headers.get('Set-Cookie'), /Secure/);
    assert.equal(pending.case.status, 'checkout');
    assert.equal(inserts[0].amount_cents, amountCents);
    assert.equal(inserts[0].name, '');
    assert.equal(inserts[0].question, '');
    assert.equal(Object.hasOwn(inserts[0], 'accepted_at'), false);
    assert.equal(inserts[0].terms_version, server.reviewTermsVersion);
    assert.ok(Date.parse(inserts[0].checkout_expires_at) > Date.now());
    assert.equal(providerCalls[0].amountCents, amountCents);
    assert.equal(providerCalls[0].caseId, pending.case.id);
    assert.equal(cases.get(pending.case.id).payment_consent.intake.personal_data_processing, true);
    assert.equal(cases.get(pending.case.id).payment_consent.intake.overseas_transfer, true);
    assert.equal(notifications.length, 0);
    const session = await (await get(cookie)).json();
    assert.equal(session.authenticated, false);
    assert.equal(session.paypalClientId, 'sample-public-id');
    assert.equal(JSON.stringify(session).includes('sample-private-secret'), false);
    assert.equal(session.directCase.id, pending.case.id);
    assert.equal(session.directOrderId, pending.orderId);
    assert.equal(session.materialsToken, null);
    assert.equal((await (await get()).json()).directCase, null);
    const capture = { action: 'capture-direct-order', caseId: pending.case.id, orderId: pending.orderId };
    assert.equal((await post(capture)).status, 404);
    assert.equal((await post({ ...capture, caseId: randomUUID() }, cookie)).status, 404);
    assert.equal((await post({ ...capture, orderId: 'wrong-order' }, cookie)).status, 409);
    assert.equal((await post({ ...capture, action: 'capture' }, cookie)).status, 401);
    assert.equal(providerCalls.length, 1);
    const paid = await (await post(capture, cookie)).json();
    assert.equal(providerCalls[1].amountCents, amountCents);
    assert.equal(providerCalls[1].orderId, pending.orderId);
    assert.equal(paid.case.status, 'paid');
    assert.equal(paid.case.deadlineAt, null);
    assert.ok(paid.materialsToken);
    const browser = new NextRequest(url + '/materials', { headers: { Cookie: cookie } });
    const row = cases.get(pending.case.id);
    assert.equal(direct.verifyMaterialsToken(browser, row, paid.materialsToken), true);
    assert.equal(direct.verifyMaterialsToken(new NextRequest(url), row, paid.materialsToken), false);
    assert.equal(direct.verifyMaterialsToken(new NextRequest('https://another.example', { headers: { Cookie: cookie } }), row, paid.materialsToken), false);
    assert.equal(direct.verifyMaterialsToken(browser, { ...row, materials_submitted_at: row.paid_at }, paid.materialsToken), false);
    assert.equal(direct.verifyMaterialsToken(browser, { ...row, status: 'refund_requested' }, paid.materialsToken), false);
    assert.equal(notifications.length, 2);
    assert.equal((await post(capture, cookie)).status, 200);
    assert.equal(providerCalls.length, 2);
    assert.equal(notifications.length, 2);
    const cancelled = await (await post({ action: 'cancel', caseId: pending.case.id }, cookie)).json();
    assert.equal(cancelled.case.status, 'refund_requested');
  }
});

test('provider failures leave a signed case for retry and never recover other cases by email alone', async () => {
  const { inserts, notifications, providerCalls, post } = directRouteHarness({ failFirstOrder: true });
  const failed = await post(orderPayload('question'));
  assert.equal(failed.status, 502);
  const cookie = responseCookie(failed);
  assert.ok(cookie);
  const retried = await post(orderPayload('question'), cookie);
  assert.equal(retried.status, 200);
  assert.equal(inserts.length, 1);
  assert.equal(providerCalls[0].idempotencyKey, providerCalls[1].idempotencyKey);
  const repeated = await post(orderPayload('question'), cookie);
  assert.equal((await repeated.json()).orderId, (await retried.json()).orderId);
  assert.equal(providerCalls.length, 2);
  const otherBrowser = await post(orderPayload('question'));
  assert.notEqual((await otherBrowser.json()).case.id, inserts[0].id);
  assert.equal(inserts.length, 2);
  assert.deepEqual(notifications, []);
});

test('the disabled direct checkout exposes no SDK configuration and creates no case', async () => {
  const { get, inserts, post } = directRouteHarness({ open: false });
  const response = await (await get()).json();
  assert.equal(response.open, false);
  assert.equal(response.paypalClientId, null);
  assert.equal((await post(orderPayload('question'))).status, 503);
  assert.deepEqual(inserts, []);
});

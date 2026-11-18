import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import {
  PayPalReviewError,
  captureReviewPayPalOrder,
  createReviewPayPalOrder,
  refundReviewPayPalCapture,
  reviewPaymentReady,
} from '../lib/visa-review-paypal.ts';
import {paymentTerms, paymentTermsAcceptance, paymentTermsSnapshot, paymentTermsVersion, refundRestrictionConditionsMet} from '../lib/visa-review-terms.ts';

const returnUrl = 'http://localhost:3000/visa-review?payment=return';
const cancelUrl = 'http://localhost:3000/visa-review?payment=cancel';
const caseId = '5dd0cfe7-b73f-4bce-8446-24c1fd867bff';
const orderId = 'TESTORDER123';
const captureId = 'TESTCAPTURE123';
const refundId = 'TESTREFUND123';
const amountCents = 9900;
const amount = { currency_code: 'USD', value: '99.00' };
const orderPath = `/v2/checkout/orders/${orderId}`;
const paymentPath = `/v2/payments/captures/${captureId}`;

function useMock(t) {
  const before = {
    VISA_REVIEW_PAYPAL_ENV: process.env.VISA_REVIEW_PAYPAL_ENV,
    VISA_REVIEW_PAYPAL_CLIENT_ID: process.env.VISA_REVIEW_PAYPAL_CLIENT_ID,
    VISA_REVIEW_PAYPAL_CLIENT_SECRET: process.env.VISA_REVIEW_PAYPAL_CLIENT_SECRET,
  };
  delete process.env.VISA_REVIEW_PAYPAL_ENV;
  process.env.VISA_REVIEW_PAYPAL_CLIENT_ID = 'mock-id';
  process.env.VISA_REVIEW_PAYPAL_CLIENT_SECRET = 'mock-secret';
  t.after(() => {
    for (const [key, value] of Object.entries(before)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  const state = { status: 'APPROVED', captureStatus: 'COMPLETED', amount, caseId, refundStatus: 'COMPLETED' };
  const requests = [];
  t.mock.method(globalThis, 'fetch', async (rawUrl, init) => {
    const url = new URL(rawUrl);
    assert.equal(url.origin, 'https://api-m.sandbox.paypal.com');
    const method = init.method ?? 'GET';
    const headers = new Headers(init.headers);
    const body = headers.get('Content-Type') === 'application/json' ? JSON.parse(init.body) : init.body;
    requests.push({ path: url.pathname, method, body, requestId: headers.get('PayPal-Request-Id') });
    if (url.pathname === '/v1/oauth2/token') {
      assert.equal(method, 'POST');
      assert.match(headers.get('Authorization'), /^Basic /);
      assert.equal(body, 'grant_type=client_credentials');
      return Response.json({ access_token: 'mock-token' });
    }
    assert.equal(headers.get('Authorization'), 'Bearer mock-token');
    if (method === 'POST') assert.match(headers.get('PayPal-Request-Id'), /^[a-f0-9]{36}$/);

    if (url.pathname === '/v2/checkout/orders' && method === 'POST') {
      return Response.json({
        id: orderId,
        status: 'PAYER_ACTION_REQUIRED',
        links: [{ rel: 'payer-action', href: `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}` }],
      }, { status: 201 });
    }
    if (url.pathname === orderPath && method === 'GET') {
      return Response.json({
        id: orderId,
        intent: 'CAPTURE',
        status: state.status,
        purchase_units: [{
          custom_id: state.caseId,
          amount: state.amount,
          payments: state.status === 'COMPLETED' ? {
            captures: [{ id: captureId, status: state.captureStatus, amount: state.captureAmount ?? state.amount, update_time: state.capturedAt }],
          } : undefined,
        }],
      });
    }
    if (url.pathname === `${orderPath}/capture` && method === 'POST') {
      state.status = 'COMPLETED';
      if (state.lostCaptureResponse) throw new TypeError('Simulated network interruption');
      return Response.json({ id: orderId, status: 'COMPLETED' }, { status: 201 });
    }
    if (url.pathname === paymentPath && method === 'GET') {
      return Response.json({
        id: captureId,
        status: state.captureStatus,
        amount: state.captureAmount ?? state.amount,
        supplementary_data: { related_ids: { order_id: orderId } },
      });
    }
    if (url.pathname === `${paymentPath}/refund` && method === 'POST') {
      if (state.refundStatus === 'COMPLETED') state.captureStatus = 'REFUNDED';
      return Response.json({ id: refundId, status: state.refundStatus, amount: state.refundAmount ?? state.amount }, { status: 201 });
    }
    if (url.pathname === `/v2/payments/refunds/${refundId}` && method === 'GET') {
      return Response.json({ id: refundId, status: state.refundStatus, amount: state.refundAmount ?? state.amount });
    }
    assert.fail(`Unexpected request ${method} ${url.pathname}`);
  });
  return { state, requests };
}

function hasCode(code) {
  return error => error instanceof PayPalReviewError && error.code === code;
}

function runLocalTests() {
  test('checkout requires explicit acceptance of each current term in a supported language', () => {
    const acceptance = {language: 'ko', termsVersion: paymentTermsVersion, koreanLaw: true, immediateReviewAndRefund: true, noVisaGuarantee: true};
    for (const language of ['ko', 'en', 'zh']) {
      assert.equal(paymentTermsAcceptance({...acceptance, language}), language);
      const receipt = paymentTermsSnapshot(language);
      for (const clause of ['governingLaw', 'startAndRefund', 'noGuarantee', 'refundPolicy']) {
        assert.ok(receipt.includes(paymentTerms[language][clause]));
      }
    }
    for (const key of ['koreanLaw', 'immediateReviewAndRefund', 'noVisaGuarantee']) {
      for (const value of [undefined, false, 'true']) {
        assert.equal(paymentTermsAcceptance({...acceptance, [key]: value}), null);
      }
    }
    assert.equal(paymentTermsAcceptance({...acceptance, termsVersion: 'old-version'}), null);
    assert.equal(paymentTermsAcceptance({...acceptance, language: 'other'}), null);
  });

  test('USD orders use the server amount, sandbox approval and a stable create key', async t => {
    const { requests } = useMock(t);
    assert.equal(reviewPaymentReady(), true);
    const input = { caseId, amountCents, returnUrl, cancelUrl, idempotencyKey: 'client-attempt-1' };
    const created = await createReviewPayPalOrder(input);
    assert.deepEqual(created, { orderId, approvalUrl: `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}` });
    await createReviewPayPalOrder(input);
    const creates = requests.filter(r => r.path === '/v2/checkout/orders');
    assert.deepEqual(creates[0].body.purchase_units, [{ amount, custom_id: caseId }]);
    assert.deepEqual(creates[0].body.payment_source.paypal.experience_context, {
      return_url: returnUrl,
      cancel_url: cancelUrl,
      user_action: 'PAY_NOW',
      shipping_preference: 'NO_SHIPPING',
    });
    assert.equal(creates[0].requestId, creates[1].requestId);
  });

  test('a refund decision tests actual start and the two-hour boundary at the time of the request', () => {
    const facts = {
      paid_at: '2026-11-17T07:00:00Z',
      started_at: '2026-11-17T07:15:00Z',
      refund_requested_at: '2026-11-17T09:00:00Z',
      payment_consent: {
        version: paymentTermsVersion, language: 'ko', accepted_at: '2026-11-17T06:55:00Z', terms: paymentTermsSnapshot('ko'),
      },
    };
    assert.equal(refundRestrictionConditionsMet(facts), true);
    assert.equal(refundRestrictionConditionsMet({...facts, refund_requested_at: '2026-11-17T08:59:59.999Z'}), false);
    assert.equal(refundRestrictionConditionsMet({...facts, started_at: null}), false);
    assert.equal(refundRestrictionConditionsMet({...facts, started_at: '2026-11-17T09:00:00.001Z'}), false);
  });

  test('missing, outdated or mismatched checkout terms cannot justify rejecting a refund', () => {
    const facts = {
      paid_at: '2026-11-17T07:00:00Z',
      started_at: '2026-11-17T07:15:00Z',
      refund_requested_at: '2026-11-17T09:00:00Z',
    };
    const receipt = {
      version: paymentTermsVersion, language: 'en', accepted_at: '2026-11-17T06:55:00Z', terms: paymentTermsSnapshot('en'),
    };
    for (const payment_consent of [
      null,
      {...receipt, version: 'old-version'},
      {...receipt, terms: paymentTermsSnapshot('ko')},
      {...receipt, accepted_at: '2026-11-17T07:00:00.001Z'},
    ]) {
      assert.equal(refundRestrictionConditionsMet({...facts, payment_consent}), false);
    }
  });

  test('capture verifies order and money before capture and recovers a lost response', async t => {
    const { requests, state } = useMock(t);
    state.lostCaptureResponse = true;
    state.capturedAt = '2026-11-17T07:30:00Z';
    const input = { orderId, caseId, amountCents };
    const captured = { orderId, captureId, capturedAt: '2026-11-17T07:30:00.000Z' };
    assert.deepEqual(await captureReviewPayPalOrder(input), captured);
    assert.deepEqual(await captureReviewPayPalOrder(input), captured);
    assert.equal(requests.filter(r => r.path.endsWith('/capture')).length, 1);
    assert.deepEqual(requests.slice(1, 4).map(r => r.method), ['GET', 'POST', 'GET']);
  });

  test('unapproved orders and mismatched currency, money or case never trigger capture', async t => {
    const { requests, state } = useMock(t);
    state.status = 'CREATED';
    await assert.rejects(captureReviewPayPalOrder({ orderId, caseId, amountCents }), hasCode('not-approved'));
    state.status = 'APPROVED';
    await assert.rejects(captureReviewPayPalOrder({ orderId, caseId: 'other-case', amountCents }), hasCode('payment-mismatch'));
    await assert.rejects(captureReviewPayPalOrder({ orderId, caseId, amountCents: 5000 }), hasCode('payment-mismatch'));
    state.amount = { ...amount, currency_code: 'EUR' };
    await assert.rejects(captureReviewPayPalOrder({ orderId, caseId, amountCents }), hasCode('payment-mismatch'));
    assert.equal(requests.filter(r => r.path.endsWith('/capture')).length, 0);
  });

  test('reconciling an earlier checkout without consent never initiates a charge', async t => {
    const { requests, state } = useMock(t);
    const input = {orderId, caseId, amountCents, existingOnly: true};
    await assert.rejects(captureReviewPayPalOrder(input), hasCode('not-approved'));
    state.status = 'COMPLETED';
    assert.deepEqual(await captureReviewPayPalOrder(input), {orderId, captureId});
    assert.equal(requests.filter(r => r.path.endsWith('/capture')).length, 0);
  });

  test('an order marked complete still needs one completed capture for the full USD amount', async t => {
    const { state } = useMock(t);
    state.status = 'COMPLETED';
    state.captureStatus = 'PENDING';
    await assert.rejects(captureReviewPayPalOrder({ orderId, caseId, amountCents }), hasCode('capture-pending'));
    state.captureStatus = 'COMPLETED';
    state.captureAmount = { ...amount, value: '98.99' };
    await assert.rejects(captureReviewPayPalOrder({ orderId, caseId, amountCents }), hasCode('payment-mismatch'));
  });

  test('refund verifies case, capture and USD total, supports retries and checks provider status', async t => {
    const { requests, state } = useMock(t);
    state.status = 'COMPLETED';
    const input = { captureId, caseId, amountCents };
    await assert.rejects(refundReviewPayPalCapture({ ...input, orderId: 'OTHERORDER' }), hasCode('payment-mismatch'));
    await assert.rejects(refundReviewPayPalCapture({ ...input, caseId: 'other-case' }), hasCode('payment-mismatch'));
    await assert.rejects(refundReviewPayPalCapture({ ...input, amountCents: 5000 }), hasCode('payment-mismatch'));
    assert.equal(requests.filter(r => r.path.endsWith('/refund')).length, 0);

    state.refundStatus = 'PENDING';
    assert.deepEqual(await refundReviewPayPalCapture(input), { refundId, status: 'PENDING' });
    state.refundStatus = 'COMPLETED';
    assert.deepEqual(await refundReviewPayPalCapture({ ...input, refundId }), { refundId, status: 'COMPLETED' });
    assert.equal(requests.at(-1).method, 'GET');
    assert.equal(requests.at(-1).path, `/v2/payments/refunds/${refundId}`);
    assert.deepEqual(await refundReviewPayPalCapture(input), { refundId, status: 'COMPLETED' });
    assert.deepEqual(await refundReviewPayPalCapture(input), { refundId, status: 'COMPLETED' });
    const refunds = requests.filter(r => r.path.endsWith('/refund'));
    assert.equal(new Set(refunds.map(r => r.requestId)).size, 1);
    assert.deepEqual(refunds[0].body, { amount });
    state.refundAmount = { ...amount, currency_code: 'EUR' };
    await assert.rejects(refundReviewPayPalCapture(input), hasCode('provider-error'));
  });

  test('missing PayPal review credentials disables checkout', async t => {
    const { requests } = useMock(t);
    delete process.env.VISA_REVIEW_PAYPAL_CLIENT_SECRET;
    assert.equal(reviewPaymentReady(), false);
    await assert.rejects(captureReviewPayPalOrder({ orderId, caseId, amountCents }), hasCode('unavailable'));
    assert.equal(requests.length, 0);
  });


}

async function runSandbox([mode, approvalOrderId, testCaseId]) {
  const configuredMode = process.env.VISA_REVIEW_PAYPAL_ENV?.trim() || 'sandbox';
  if (configuredMode !== 'sandbox') throw new Error('Sandbox tests require VISA_REVIEW_PAYPAL_ENV=sandbox.');
  if (!reviewPaymentReady()) throw new Error('Sandbox testing requires the visa review PayPal sandbox client ID and secret.');

  const testAmountCents = 5500;
  if (mode === '--sandbox-create') {
    const testId = `sandbox-${randomUUID()}`;
    const result = await createReviewPayPalOrder({
      caseId: testId,
      amountCents: testAmountCents,
      returnUrl: process.env.VISA_REVIEW_PAYPAL_SANDBOX_RETURN_URL || returnUrl,
      cancelUrl: process.env.VISA_REVIEW_PAYPAL_SANDBOX_CANCEL_URL || cancelUrl,
      idempotencyKey: testId,
    });
    console.log(`Approve USD ${(testAmountCents / 100).toFixed(2)} with a PayPal Sandbox buyer account: ${result.approvalUrl}`);
    console.log(`Then run: node scripts/visa-review-paypal-test.mjs --sandbox-complete ${result.orderId} ${testId}`);
    return;
  }

  if (mode !== '--sandbox-complete' || !approvalOrderId || !/^sandbox-[a-f0-9-]{36}$/.test(testCaseId ?? '')) {
    throw new Error('Use --sandbox-create or --sandbox-complete ORDER_ID SANDBOX_CASE_ID.');
  }
  const result = await captureReviewPayPalOrder({ orderId: approvalOrderId, caseId: testCaseId, amountCents: testAmountCents });
  console.log('PayPal Sandbox capture completed.');
  const refund = await refundReviewPayPalCapture({ ...result, caseId: testCaseId, amountCents: testAmountCents });
  console.log(`PayPal Sandbox refund status: ${refund.status}`);
  if (refund.status !== 'COMPLETED') process.exitCode = 1;
}

const args = process.argv.slice(2);
if (args.length === 0) runLocalTests();
else {
  try {
    await runSandbox(args);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

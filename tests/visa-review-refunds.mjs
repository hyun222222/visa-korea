import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';

const source = ts.transpileModule(readFileSync(new URL('../lib/visa-review-workflow.ts', import.meta.url), 'utf8'), {
  compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
}).outputText;

class ReviewError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

function harness(overrides = {}) {
  let current = {
    id: randomUUID(), plan: 'documents', amount_cents: 9900, status: 'in_review',
    payment_order_id: 'order', payment_capture_id: 'capture', payment_environment: 'sandbox',
    started_at: new Date(Date.now() - 300000).toISOString(), paid_at: new Date(Date.now() - 600000).toISOString(),
    updated_at: new Date(Date.now() - 100000).toISOString(), refund_operations: [],
    ...overrides,
  };
  const calls = [];
  const notifications = [];
  const control = {pending: false, fail: false, terminalFailure: false};
  const provider = new Map();
  async function save(previous, changes) {
    if (previous.updated_at !== current.updated_at || previous.status !== current.status) return null;
    current = {...current, ...changes,
      updated_at: new Date(Math.max(Date.now(), Date.parse(current.updated_at) + 1)).toISOString()};
    return structuredClone(current);
  }
  const imports = {
    'server-only': {},
    'node:crypto': {randomUUID},
    './visa-review-terms': {},
    './visa-review-server': {
      ReviewError, reviewPlans: {documents: {amountCents: 9900}}, reviewPaymentEnvironment: () => 'sandbox',
      changeReviewCase: save, loadReviewCase: async () => structuredClone(current),
      transitionReviewCase: async (c, patch) => {
        const saved = await save(c, patch);
        if (!saved) throw new ReviewError('Concurrent update', 409);
        return saved;
      },
      notifyReview: async (_c, event) => notifications.push(event),
    },
    './visa-review-paypal': {
      reviewPaymentReady: () => true,
      refundReviewPayPalCapture: async (input) => {
        calls.push({...input});
        if (control.fail) { control.fail = false; throw new Error('Lost network response'); }
        if (input.operationId) {
          assert.ok(current.refund_operations.some((item) => item.id === input.operationId &&
            item.amount_cents === input.refundAmountCents));
        }
        const id = input.operationId ?? 'legacy';
        if (!provider.has(id)) provider.set(id, {refundId: 'refund-' + (provider.size + 1)});
        return {...provider.get(id), status: control.terminalFailure ? 'FAILED' : control.pending ? 'PENDING' : 'COMPLETED'};
      },
    },
  };
  const exports = {};
  runInNewContext(source, {exports, require: name => imports[name], process: {env: {}}, URL});
  return {
    calls, notifications, control, snapshot: () => structuredClone(current),
    expireLease: () => {current.updated_at = new Date(Date.now() - 100000).toISOString();},
    refund: (instruction, snapshot = structuredClone(current)) => exports.refundCase(snapshot, instruction),
  };
}

function instruction(amountCents, reason = 'Agreed amount after calculating the completed work') {
  return {operationId: randomUUID(), amountCents, reason, settlementConfirmed: true};
}

test('partial refund, identical retry and remaining-balance refund preserve a complete audit trail', async () => {
  const h = harness();
  const partial = instruction(3300);
  let c = await h.refund(partial);
  assert.equal(c.status, 'partially_refunded');
  assert.equal(c.refund_operations[0].amount_cents, 3300);
  await h.refund(partial);
  assert.equal(h.calls.length, 1);
  c = await h.refund(instruction(6600));
  assert.equal(c.status, 'refunded');
  assert.equal(c.refund_operations.length, 2);
  assert.equal(c.refund_operations.reduce((sum, op) => sum + op.amount_cents, 0), 9900);
  assert.notEqual(h.calls[0].operationId, h.calls[1].operationId);
  await assert.rejects(h.refund(instruction(1)), {status: 409});
});

test('invalid amounts cannot save a refund operation or call PayPal', async () => {
  const h = harness();
  for (const amount of [0, -1, 9901, 1.1, NaN]) {
    await assert.rejects(h.refund(instruction(amount)), {status: 422});
  }
  assert.equal(h.calls.length, 0);
  assert.equal(h.snapshot().refund_operations.length, 0);
});

test('cancellation before actual start requires the full remaining balance', async () => {
  const h = harness({status: 'paid', started_at: null});
  await assert.rejects(h.refund(instruction(3300)), {status: 409});
  assert.equal((await h.refund(instruction(9900))).status, 'refunded');
});

test('partial refunds require an explicit customer settlement attestation', async () => {
  const h = harness();
  await assert.rejects(h.refund({...instruction(3300), settlementConfirmed: false}), {status: 422});
  assert.equal(h.calls.length, 0);
});

test('delivery within two hours does not block a full refund', async () => {
  const h = harness({status: 'delivered', delivered_at: new Date().toISOString()});
  const c = await h.refund(instruction(9900));
  assert.equal(c.status, 'refunded');
  assert.ok(c.delivered_at);
});

test('a pending refund prevents a second operation and can later complete', async () => {
  const h = harness();
  h.control.pending = true;
  const partial = instruction(3300);
  assert.equal((await h.refund(partial)).status, 'refunding');
  h.expireLease();
  await assert.rejects(h.refund(instruction(6600)), {status: 409});
  assert.equal(h.calls.length, 1);
  h.control.pending = false;
  const c = await h.refund();
  assert.equal(c.status, 'partially_refunded');
  assert.equal(h.calls[1].refundId, h.calls[0] ? 'refund-1' : null);
  assert.equal(h.calls[1].operationId, partial.operationId);
});

test('network retry uses the already saved operation and exact amount', async () => {
  const h = harness();
  h.control.fail = true;
  const partial = instruction(3300);
  await assert.rejects(h.refund(partial), /Lost network response/);
  assert.equal(h.snapshot().status, 'refunding');
  h.expireLease();
  const c = await h.refund();
  assert.equal(c.status, 'partially_refunded');
  assert.equal(h.calls[0].operationId, h.calls[1].operationId);
  assert.equal(h.calls[1].refundAmountCents, 3300);
  assert.equal(h.calls[1].reconcileOnly, false);
});

test('a confirmed provider failure stays in history and allows a newly approved operation', async () => {
  const h = harness();
  h.control.terminalFailure = true;
  const first = instruction(3300);
  let c = await h.refund(first);
  assert.equal(c.status, 'refund_requested');
  assert.equal(c.refund_operations[0].status, 'failed');
  await h.refund(first);
  assert.equal(h.calls.length, 1);
  h.control.terminalFailure = false;
  c = await h.refund(instruction(3300));
  assert.equal(c.status, 'partially_refunded');
  assert.equal(c.refund_operations.length, 2);
  assert.equal(c.refund_operations[0].status, 'failed');
  assert.equal(c.refund_operations[1].status, 'completed');
});

test('after PayPal request-id retention only reconciliation is allowed', async () => {
  const op = {
    id: randomUUID(), amount_cents: 3300, reason: 'Earlier agreed refund', status: 'requested',
    requested_at: new Date(Date.now() - 46 * 86400000).toISOString(), provider_id: null, completed_at: null,
  };
  const h = harness({status: 'refunding', refund_operations: [op]});
  await h.refund();
  assert.equal(h.calls[0].reconcileOnly, true);
});

test('concurrent different refund instructions allow only one provider request', async () => {
  const h = harness();
  const snapshot = h.snapshot();
  const outcomes = await Promise.allSettled([
    h.refund(instruction(3300), snapshot),
    h.refund(instruction(6600), snapshot),
  ]);
  assert.equal(outcomes.filter((item) => item.status === 'fulfilled').length, 1);
  assert.equal(h.calls.length, 1);
  assert.equal(h.snapshot().refund_operations.length, 1);
});

test('legacy in-flight full refunds keep their existing provider key and identifier', async () => {
  const h = harness({status: 'refunding', refund_id: 'old-refund', refund_operations: null});
  assert.equal((await h.refund()).status, 'refunded');
  assert.equal(h.calls[0].refundId, 'old-refund');
  assert.equal(h.calls[0].operationId, undefined);
  assert.equal(h.calls[0].amountCents, 9900);
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const origin = 'https://review.koreavisalaw.com';
const caseId = '4cd10aef-2e13-4392-8ea0-9865dbaff66c';
const fixture = 'MATERIALS-MOCK-QUESTION';
const {outputText} = ts.transpileModule(readFileSync('app/api/visa-review/materials/route.ts', 'utf8'), {
  compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS},
});

class ReviewError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function harness({mailSucceeds = true, enabled = true, deferMail} = {}) {
  let row = {id: caseId, status: 'paid', plan: 'question', email: 'applicant@example.invalid', payment_capture_id: 'mock-capture',
    materials_submission_started_at: null, materials_submitted_at: null};
  const updates = [];
  const emails = [];
  const transition = async (current, changes) => {
    if (current !== row) return null;
    updates.push(changes);
    row = {...row, ...changes};
    return row;
  };
  const server = {
    changeReviewCase: transition,
    loadReviewCase: async id => {
      assert.equal(id, caseId);
      return row;
    },
    publicReviewCase: c => ({id: c.id, materialsSubmittedAt: c.materials_submitted_at}),
    ReviewError, reviewCaseId: value => value, reviewConfigured: () => true,
    reviewFailure: e => Response.json({error: e.message}, {status: e.status ?? 502}),
    reviewJson: data => Response.json(data), reviewMaterialsSubmissionEnabled: () => enabled,
    reviewOffice: 'Office', reviewText: (value, max) => {
      if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw new ReviewError('Invalid input');
      return value.trim();
    },
    sendReviewEmail: async (...args) => {
      emails.push(args);
      if (deferMail) await deferMail;
      if (!mailSucceeds) throw new Error('Provider rejected mock mail');
    },
    transitionReviewCase: async (current, changes) => {
      const saved = await transition(current, changes);
      if (!saved) throw new ReviewError('Case updated', 409);
      return saved;
    },
    verifyReviewOrigin: request => {
      if (request.headers.get('origin') !== origin) throw new ReviewError('Invalid origin', 403);
    },
  };
  const imports = {
    '@/lib/visa-review-server': server,
    '@/lib/visa-review-direct': {verifyMaterialsToken: (_, c, token) => token === 'mock-claim' && !c.materials_submitted_at && c.status === 'paid'},
  };
  const exports = {};
  vm.runInNewContext(outputText, {exports, require: name => imports[name], Response, Buffer, Uint8Array});
  return {
    updates, emails,
    post({source = origin, token = 'mock-claim', question = fixture, file = new Blob(['%PDF-1.7 mock'], {type: 'application/pdf'})} = {}) {
      const form = new FormData();
      for (const [key, value] of Object.entries({caseId, token, name: 'Mock applicant', question})) form.set(key, value);
      form.append('files', file, 'mock.pdf');
      return exports.POST(new Request(origin + '/api/visa-review/materials', {method: 'POST', headers: {origin: source}, body: form}));
    },
  };
}

test('paid material submission sends one attachment and records timestamps only', async () => {
  const h = harness();
  const submitted = await h.post();
  assert.equal(submitted.status, 200);
  assert.ok((await submitted.json()).case.materialsSubmittedAt);
  const [to, subject, text, key, options] = h.emails[0];
  assert.equal(to, 'info@kimnhyun.com');
  assert.ok(subject.includes(caseId));
  assert.ok(text.includes(fixture) && text.includes('mock-capture'));
  assert.equal(key, `visa-review/${caseId}/materials`);
  assert.equal(options.replyTo, 'applicant@example.invalid');
  assert.equal(options.attachments[0].filename, 'mock.pdf');
  assert.equal(Buffer.from(options.attachments[0].content, 'base64').toString(), '%PDF-1.7 mock');
  assert.deepEqual(h.updates.flatMap(Object.keys), ['materials_submission_started_at', 'materials_submission_started_at', 'materials_submitted_at']);
  assert.equal((await h.post()).status, 403);
  assert.equal(h.emails.length, 1);
});

test('materials are never forwarded for the wrong token, origin, size, type or plan length', async () => {
  const h = harness();
  assert.equal((await h.post({token: 'other-case'})).status, 403);
  assert.equal((await h.post({source: 'https://untrusted.invalid'})).status, 403);
  assert.equal((await h.post({file: new Blob([new Uint8Array(4_000_001)], {type: 'application/pdf'})})).status, 413);
  assert.equal((await h.post({file: new Blob(['spoof PDF'], {type: 'application/pdf'})})).status, 422);
  assert.equal((await h.post({question: 'x'.repeat(601)})).status, 400);
  assert.equal((await harness({enabled: false}).post()).status, 503);
  assert.deepEqual(h.emails, []);
  assert.deepEqual(h.updates, []);
});

test('claims block double submission and a mail failure leaves no submission timestamp', async () => {
  let releaseMail;
  const deferMail = new Promise(resolve => { releaseMail = resolve; });
  const h = harness({mailSucceeds: false, deferMail});
  const first = h.post();
  while (!h.emails.length) await new Promise(resolve => setImmediate(resolve));
  assert.equal((await h.post()).status, 409);
  releaseMail();
  assert.equal((await first).status, 502);
  assert.equal(h.emails.length, 1);
  assert.equal(h.updates[1].materials_submission_started_at, null);
  assert.equal(Object.hasOwn(h.updates[1], 'materials_submitted_at'), false);
});

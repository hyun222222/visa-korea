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
const {outputText: serverOutput} = ts.transpileModule(readFileSync('lib/visa-review-server.ts', 'utf8'), {
  compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS},
});
const {outputText: attachmentOutput} = ts.transpileModule(readFileSync('lib/visa-review-attachments.ts', 'utf8'), {
  compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS},
});
const attachmentPolicy = {};
vm.runInNewContext(attachmentOutput, {exports: attachmentPolicy});
const pdf = () => new Blob(['%PDF-1.7 mock'], {type: 'application/pdf'});

function serverPolicy(env, mail = []) {
  const exports = {};
  vm.runInNewContext(serverOutput, {
    exports, require: () => ({}), process: {env}, AbortSignal,
    fetch: async (_url, options) => {
      mail.push(JSON.parse(options.body));
      return {ok: true};
    },
  });
  return exports;
}

class ReviewError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function harness({mailSucceeds = true, enabled = true, deferMail, env = {}, caseEnvironment = 'sandbox', plan = 'question'} = {}) {
  let row = {id: caseId, status: 'paid', plan, email: 'applicant@example.invalid', payment_capture_id: 'mock-capture',
    payment_environment: caseEnvironment, materials_submission_started_at: null, materials_submitted_at: null};
  const {reviewMaterialsSubmissionEnabled} = serverPolicy(env);
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
    reviewJson: data => Response.json(data), reviewMaterialsSubmissionEnabled: c => enabled && reviewMaterialsSubmissionEnabled(c),
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
    '@/lib/visa-review-attachments': attachmentPolicy,
    '@/lib/visa-review-server': server,
    '@/lib/visa-review-direct': {verifyMaterialsToken: (_, c, token) => token === 'mock-claim' && !c.materials_submitted_at && c.status === 'paid'},
  };
  const exports = {};
  vm.runInNewContext(outputText, {exports, require: name => imports[name], Response, Buffer, Uint8Array});
  return {
    updates, emails,
    post({source = origin, token = 'mock-claim', question = fixture, files = []} = {}) {
      const form = new FormData();
      for (const [key, value] of Object.entries({caseId, token, name: 'Mock applicant', question})) form.set(key, value);
      for (const file of files) form.append('files', file, 'mock.pdf');
      return exports.POST(new Request(origin + '/api/visa-review/materials', {method: 'POST', headers: {origin: source}, body: form}));
    },
  };
}

test('paid material submission sends one attachment and records timestamps only', async () => {
  const h = harness({plan: 'documents'});
  const submitted = await h.post({files: [pdf()]});
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
  assert.equal((await h.post({question: 'x'.repeat(601)})).status, 400);
  assert.equal((await harness({enabled: false}).post()).status, 503);
  assert.deepEqual(h.emails, []);
  assert.deepEqual(h.updates, []);

  const docs = harness({plan: 'documents'});
  assert.equal((await docs.post({files: [new Blob([new Uint8Array(4_000_001)], {type: 'application/pdf'})]})).status, 413);
  assert.equal((await docs.post({files: [new Blob(['spoof PDF'], {type: 'application/pdf'})]})).status, 422);
  assert.equal((await docs.post({files: [new Blob([], {type: 'application/pdf'})]})).status, 422);
  assert.deepEqual(docs.emails, []);
  assert.deepEqual(docs.updates, []);
});

test('paid case plan sets the attachment count limit before email or case updates', async () => {
  for (const [plan, acceptedCount] of [['question', 0], ['documents', 2], ['strategy', 5]]) {
    const h = harness({plan});
    const refused = await h.post({files: Array.from({length: acceptedCount + 1}, pdf)});
    assert.equal(refused.status, 422, plan);
    assert.deepEqual(h.emails, [], plan);
    assert.deepEqual(h.updates, [], plan);
    const accepted = await h.post({files: Array.from({length: acceptedCount}, pdf)});
    assert.equal(accepted.status, 200, plan);
    assert.equal(h.emails[0][4].attachments.length, acceptedCount, plan);
  }
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

test('materials must match the deployment payment environment even with a valid token', async () => {
  const preview = harness({caseEnvironment: 'live', env: {
    VERCEL_ENV: 'preview', VISA_REVIEW_PAYPAL_ENV: 'sandbox', VISA_REVIEW_RESEND_CONTENT_APPROVED: 'true',
  }});
  assert.equal((await preview.post()).status, 403);
  assert.deepEqual(preview.emails, []);
  assert.deepEqual(preview.updates, []);

  const production = harness({caseEnvironment: 'live', env: {
    VERCEL_ENV: 'production', VISA_REVIEW_PAYPAL_ENV: 'live', VISA_REVIEW_RESEND_CONTENT_APPROVED: 'true',
  }});
  assert.equal((await production.post()).status, 200);
  assert.equal(production.emails.length, 1);
});

test('result emails require the case payment environment and the appropriate deployment approval', async () => {
  const result = 'Synthetic written review test result.';
  const delivered = {id: caseId, status: 'delivered', email: 'applicant@example.invalid', language: 'ko',
    delivered_at: new Date().toISOString(), result};
  const approved = {VISA_REVIEW_RESEND_CONTENT_APPROVED: 'true'};
  const trial = {VISA_REVIEW_TRIAL: 'true'};
  const checks = [
    {environment: 'preview', mode: 'sandbox', caseMode: 'sandbox', sent: true},
    {environment: 'preview', mode: 'sandbox', caseMode: 'live', flags: approved, sent: false},
    {environment: 'preview', mode: 'sandbox', caseMode: null, sent: false},
    {environment: 'preview', mode: 'live', caseMode: 'live', flags: approved, sent: false},
    {environment: 'preview', mode: 'live', caseMode: 'live', flags: trial, sent: false},
    {environment: 'preview', mode: 'live', caseMode: 'live', flags: {...approved, ...trial}, sent: true},
    {environment: 'production', mode: 'sandbox', caseMode: 'sandbox', flags: approved, sent: false},
    {environment: 'production', mode: undefined, caseMode: 'live', flags: approved, sent: false},
    {environment: 'production', mode: 'live', caseMode: 'live', sent: false},
    {environment: 'production', mode: 'live', caseMode: 'sandbox', flags: approved, sent: false},
    {environment: 'production', mode: 'live', caseMode: 'live', flags: approved, sent: true},
  ];
  for (const {environment, mode, caseMode, flags, sent} of checks) {
    const mail = [];
    const {notifyReview} = serverPolicy({VERCEL_ENV: environment, VISA_REVIEW_PAYPAL_ENV: mode, ...flags}, mail);
    const warning = await notifyReview({...delivered, payment_environment: caseMode}, 'result_email');
    assert.equal(mail.length, Number(sent), `${environment}/${mode}/${caseMode}`);
    assert.equal(Boolean(warning), !sent);
    if (sent) {
      assert.equal(mail[0].to, delivered.email);
      assert.ok(mail[0].text.includes(result));
    }
  }
});

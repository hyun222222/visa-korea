import 'server-only';
import {timingSafeEqual} from 'node:crypto';
import type {NextRequest, NextResponse} from 'next/server';
import {digestReview, reviewCaseId, usesPayFirstReview, type ReviewCase} from './visa-review-server';

const cookieName = 'kv_visa_review_direct';
const sessionAge = 24 * 60 * 60;

function signaturesMatch(expected: string, provided: unknown) {
  return typeof provided === 'string' && /^[a-f0-9]{64}$/.test(provided) &&
    timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(provided, 'hex'));
}

export function setReviewDirectCase(response: NextResponse, request: Request, caseId: string) {
  const expiration = Math.floor(Date.now() / 1000) + sessionAge;
  const url = new URL(request.url);
  const payload = Buffer.from(JSON.stringify({caseId, expiration, origin: url.origin})).toString('base64url');
  response.cookies.set(cookieName, `${payload}.${digestReview('direct-case:' + payload)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: url.protocol === 'https:',
    path: '/api/visa-review',
    maxAge: sessionAge,
  });
  return response;
}

export function reviewDirectCaseId(request: NextRequest): string | null {
  const cookie = request.cookies.get(cookieName)?.value;
  if (!cookie || cookie.length > 512) return null;
  const [payload, signature, ...rest] = cookie.split('.');
  if (!payload || rest.length) return null;
  try {
    if (!signaturesMatch(digestReview('direct-case:' + payload), signature)) return null;
    const {caseId, expiration, origin} = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return origin === new URL(request.url).origin && Number.isSafeInteger(expiration) && expiration > Math.floor(Date.now() / 1000)
      ? reviewCaseId(caseId)
      : null;
  } catch {
    return null;
  }
}

export function getMaterialsToken(c: ReviewCase): string | null {
  if (!usesPayFirstReview(c) || c.status !== 'paid' || !c.payment_capture_id ||
    !Number.isFinite(Date.parse(c.paid_at ?? '')) || c.materials_submitted_at) return null;
  return digestReview('direct-materials:' + JSON.stringify([c.id, c.payment_capture_id]));
}

export function verifyMaterialsToken(request: NextRequest, c: ReviewCase, providedToken: unknown) {
  if (reviewDirectCaseId(request) !== c.id) return false;
  const expected = getMaterialsToken(c);
  return expected !== null && signaturesMatch(expected, providedToken);
}

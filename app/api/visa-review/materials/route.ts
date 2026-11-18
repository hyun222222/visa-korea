import type {NextRequest} from 'next/server';
import {verifyMaterialsToken} from '@/lib/visa-review-direct';
import {
  changeReviewCase,
  loadReviewCase,
  publicReviewCase,
  ReviewError,
  reviewCaseId,
  reviewConfigured,
  reviewFailure,
  reviewJson,
  reviewMaterialsSubmissionEnabled,
  reviewOffice,
  reviewText,
  sendReviewEmail,
  transitionReviewCase,
  verifyReviewOrigin,
  type ReviewCase,
} from '@/lib/visa-review-server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const fileLimit = 4_000_000;
const requestLimit = 4_400_000;
const transmissionLease = 90_000;
const officeMailbox = 'info@kimnhyun.com';

async function boundedForm(request: NextRequest) {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.startsWith('multipart/form-data;')) throw new ReviewError('Send a file submission form.', 415);
  if (Number(request.headers.get('content-length') ?? 0) > requestLimit) {
    throw new ReviewError('Attachments must total 4 MB or less.', 413);
  }
  const reader = request.body?.getReader();
  if (!reader) throw new ReviewError('A submission is required.');
  const buffer = new Uint8Array(requestLimit);
  let size = 0;
  for (;;) {
    const {done, value} = await reader.read();
    if (done) break;
    if (size + value.byteLength > requestLimit) {
      await reader.cancel().catch(() => {});
      throw new ReviewError('Attachments must total 4 MB or less.', 413);
    }
    buffer.set(value, size);
    size += value.byteLength;
  }
  try {
    return await new Response(buffer.subarray(0, size), {headers: {'Content-Type': contentType}}).formData();
  } catch {
    throw new ReviewError('The submitted form could not be read.');
  }
}

async function emailAttachment(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  let extension: string;
  let contentType: string;
  if (bytes.subarray(0, 5).toString('ascii') === '%PDF-') {
    extension = 'pdf';
    contentType = 'application/pdf';
  } else if (bytes.subarray(0, 3).toString('hex') === 'ffd8ff') {
    extension = 'jpg';
    contentType = 'image/jpeg';
  } else if (bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a') {
    extension = 'png';
    contentType = 'image/png';
  } else {
    throw new ReviewError('Only PDF, JPG and PNG files are accepted.', 422);
  }
  if (file.type !== contentType) throw new ReviewError('The file must match its stated PDF, JPG or PNG format.', 422);
  const stem = file.name.replace(/\.[^.]*$/, '').replace(/[^\p{L}\p{N}._ -]/gu, '_').trim().slice(0, 100);
  return {filename: (stem || 'document') + '.' + extension, content: bytes.toString('base64'), content_type: contentType};
}

async function uploadedFiles(form: FormData) {
  const files = form.getAll('files');
  if (files.length > 5 || files.some((file) => typeof file === 'string')) {
    throw new ReviewError('Provide up to five PDF, JPG or PNG attachments.', 422);
  }
  const attachments = files as File[];
  if (attachments.reduce((total, file) => total + file.size, 0) > fileLimit) {
    throw new ReviewError('Attachments must total 4 MB or less.', 413);
  }
  return Promise.all(attachments.map(emailAttachment));
}

async function finishSubmission(claimed: ReviewCase) {
  const changes = {materials_submission_started_at: null, materials_submitted_at: new Date().toISOString()};
  const saved = await changeReviewCase(claimed, changes);
  if (saved) return saved;
  const current = await loadReviewCase(claimed.id);
  if (current.materials_submitted_at) return current;
  if (current.materials_submission_started_at !== claimed.materials_submission_started_at) {
    throw new ReviewError('Refresh the case to check its submission status.', 409);
  }
  return transitionReviewCase(current, changes);
}

export async function POST(request: NextRequest) {
  try {
    verifyReviewOrigin(request);
    if (!reviewConfigured() || !reviewMaterialsSubmissionEnabled()) {
      throw new ReviewError('Please email the materials to the office with your case reference.', 503);
    }
    const form = await boundedForm(request);
    const c = await loadReviewCase(reviewCaseId(form.get('caseId')));
    if (!verifyMaterialsToken(request, c, form.get('token')) || !reviewMaterialsSubmissionEnabled(c)) {
      throw new ReviewError('The materials submission is not available for this case.', 403);
    }
    if (Date.now() - Date.parse(c.materials_submission_started_at ?? '') < transmissionLease) {
      throw new ReviewError('Materials are already being sent. Check the case status shortly.', 409);
    }
    const name = reviewText(form.get('name'), 120);
    const question = reviewText(form.get('question'), c.plan === 'question' ? 600 : 6000);
    const attachments = await uploadedFiles(form);
    const claimed = await transitionReviewCase(c, {materials_submission_started_at: new Date().toISOString()});
    try {
      await sendReviewEmail(officeMailbox, '[' + reviewOffice + '] 비자 서면검토 자료 ' + c.id,
        ['접수번호 ' + c.id, 'PayPal 거래 ID ' + c.payment_capture_id, '신청인 ' + name, '질문\n' + question].join('\n\n'),
        'visa-review/' + c.id + '/materials', {replyTo: c.email, attachments});
    } catch {
      await changeReviewCase(claimed, {materials_submission_started_at: null}).catch(() => {});
      throw new ReviewError('Materials could not be emailed. Use the office email shown with your case reference.', 502);
    }
    const saved = await finishSubmission(claimed);
    return reviewJson({case: publicReviewCase(saved)});
  } catch (error) {
    return reviewFailure(error);
  }
}

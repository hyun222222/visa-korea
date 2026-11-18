import {admin, db} from '@/lib/airport-server';
import {
  changeReviewCase,
  loadReviewCase,
  notifyReview,
  ReviewError,
  reviewBucket,
  reviewCaseId,
  reviewFailure,
  reviewJson,
  reviewText,
  transitionReviewCase,
  usesPayFirstReview,
  verifyReviewOrigin,
  type ReviewCase,
  type ReviewStatus,
} from '@/lib/visa-review-server';
import {refundRestrictionConditionsMet} from '@/lib/visa-review-terms';
import {captureCase, refundCase, reviewDayMs} from '@/lib/visa-review-workflow';

const queueFields = [
  'id', 'email', 'name', 'visa', 'plan', 'amount_cents', 'question', 'counterparty', 'language', 'status',
  'submitted_at', 'paid_at', 'materials_submitted_at', 'deadline_at', 'checkout_expires_at',
  'payment_order_id', 'payment_environment',
  'payment_consent', 'started_at', 'delivered_at', 'result_emailed_at', 'refund_requested_at', 'refund_id',
  'refund_resolved_at', 'refund_resolution_reason', 'result',
] as const satisfies readonly (keyof ReviewCase)[];
const queueColumns = [...queueFields, 'terms_version'] as const;
type ReviewQueueRow = Pick<ReviewCase, (typeof queueColumns)[number]>;

const actions = ['accept', 'decline', 'start', 'deliver', 'send-result-email', 'files', 'reconcile', 'refund', 'confirm-refund', 'decline-refund'] as const;
type Action = typeof actions[number];

async function requireAdmin(request: Request) {
  if (!/^Bearer \S+$/.test(request.headers.get('authorization') ?? '')) {
    throw new ReviewError('사무소 관리자 로그인이 필요합니다.', 401);
  }
  try {
    return await admin(request);
  } catch {
    throw new ReviewError('사무소 관리자 권한이 필요합니다.', 403);
  }
}

function queueCase(c: ReviewQueueRow) {
  return {...Object.fromEntries(queueFields.map((field) => [field, c[field]])), payFirst: usesPayFirstReview(c)};
}

function requireStatus(c: ReviewCase, ...statuses: ReviewStatus[]) {
  if (!statuses.includes(c.status)) {
    throw new ReviewError('현재 사건 상태에서는 이 작업을 할 수 없습니다. 새로고침 후 확인하세요.', 409);
  }
}

async function requestAction(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object' || !actions.includes(body.action)) {
    throw new ReviewError('관리 작업을 선택하세요.');
  }
  if (body.action === 'refund' &&
    ['refundAmountCents', 'refundOperationId', 'settlementConfirmed'].some((field) => Object.hasOwn(body, field))) {
    throw new ReviewError('전액 환불만 지원합니다. 최신 관리자 화면에서 다시 확인하세요.', 422);
  }
  return {
    caseId: reviewCaseId(body.caseId), action: body.action as Action, result: body.result as unknown,
    reason: body.reason as unknown, refundRequestedAt: body.refundRequestedAt as unknown,
    materialsConfirmed: body.materialsConfirmed === true,
  };
}

async function fileLinks(caseId: string) {
  const client = db();
  const {data, error} = await client.from('visa_review_documents')
    .select('name,path').eq('case_id', caseId).order('id');
  if (error) throw error;
  return Promise.all(data.map(async ({name, path}) => {
    const {data: link, error: signingError} = await client.storage.from(reviewBucket)
      .createSignedUrl(path, 60, {download: name});
    if (signingError) throw signingError;
    return {name, url: link.signedUrl};
  }));
}

async function sendSavedResult(c: ReviewCase) {
  if (!usesPayFirstReview(c) || !c.delivered_at || !c.result) {
    throw new ReviewError('등록된 서면 결과를 확인하세요.', 409);
  }
  if (c.result_emailed_at) return reviewJson({case: queueCase(c), message: '결과 이메일 발송이 이미 확인됐습니다.'});

  const warning = await notifyReview(c, 'result_email');
  if (warning) return reviewJson({case: queueCase(c), warning});

  const emailSentAt = {result_emailed_at: new Date().toISOString()};
  let current = c;
  try {
    const saved = await changeReviewCase(current, emailSentAt);
    current = saved ?? await loadReviewCase(c.id);
    if (!current.result_emailed_at) current = await changeReviewCase(current, emailSentAt) ?? current;
  } catch {
    // The provider accepted the email. The retry reuses the case's idempotency key.
  }
  return reviewJson({
    case: queueCase(current),
    ...(current.result_emailed_at
      ? {message: '등록한 서면 결과의 이메일 발송 요청이 접수됐습니다.'}
      : {warning: '결과 이메일 발송 요청은 접수됐지만 발송 시각을 저장하지 못했습니다. 메일 발송 이력을 확인하세요.'}),
  });
}

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const {data, error} = await db().from('visa_review_cases').select(queueColumns.join(','))
      .order('submitted_at', {ascending: false}).order('id', {ascending: false})
      .overrideTypes<ReviewQueueRow[], {merge: false}>();
    if (error) throw error;
    return reviewJson({cases: data.map(queueCase)});
  } catch (error) {
    return reviewFailure(error);
  }
}

export async function POST(request: Request) {
  try {
    const operator = await requireAdmin(request);
    verifyReviewOrigin(request);
    const {caseId, action, result, reason, refundRequestedAt, materialsConfirmed} = await requestAction(request);
    const c = await loadReviewCase(caseId);
    if (action === 'files') return reviewJson({files: await fileLinks(c.id)});

    let saved: ReviewCase;
    let warning: string | undefined;
    switch (action) {
      case 'accept': {
        requireStatus(c, 'submitted');
        if (usesPayFirstReview(c)) throw new ReviewError('이 사건은 결제 후에 자료와 수임 여부를 확인합니다.', 409);
        if (!materialsConfirmed) throw new ReviewError('메일 자료의 완비 여부와 이해충돌을 확인하세요.');
        const accepted = Date.now();
        saved = await transitionReviewCase(c, {
          status: 'accepted', accepted_at: new Date(accepted).toISOString(), accepted_by: operator.id,
          checkout_expires_at: new Date(accepted + reviewDayMs).toISOString(),
        });
        warning = await notifyReview(saved, 'accepted');
        break;
      }
      case 'decline':
        requireStatus(c, 'submitted', 'accepted');
        saved = await transitionReviewCase(c, {status: 'declined'});
        warning = await notifyReview(saved, 'declined');
        break;
      case 'start': {
        requireStatus(c, 'paid');
        const started = Date.now();
        const startedAt = new Date(started).toISOString();
        const payFirst = usesPayFirstReview(c);
        if (payFirst) {
          if (!materialsConfirmed) throw new ReviewError('메일 자료의 완비 여부와 이해충돌을 확인하세요.');
          const paidAt = Date.parse(c.paid_at ?? '');
          if (!c.payment_order_id || !c.payment_capture_id || !c.payment_environment || !Number.isFinite(paidAt) || paidAt > started) {
            throw new ReviewError('확정된 PayPal 결제를 확인해야 검토를 시작할 수 있습니다.', 409);
          }
        }
        saved = await transitionReviewCase(c, {
          status: 'in_review', started_at: startedAt,
          ...(payFirst ? {
            accepted_at: startedAt, accepted_by: operator.id,
            deadline_at: new Date(started + reviewDayMs).toISOString(),
          } : {}),
        });
        break;
      }
      case 'deliver': {
        requireStatus(c, 'in_review');
        const paidAt = Date.parse(c.paid_at ?? '');
        if (!Number.isFinite(paidAt) || Date.now() < paidAt + 2 * 60 * 60 * 1000) {
          throw new ReviewError('결제 확인 시각부터 2시간이 지난 뒤에 검토 결과를 전달할 수 있습니다.', 409);
        }
        const opinion = reviewText(result, 20_000);
        if (opinion.length < 20) throw new ReviewError('서면 검토 결과를 20자 이상 입력하세요.');
        saved = await transitionReviewCase(c, {status: 'delivered', result: opinion, delivered_at: new Date().toISOString()});
        if (usesPayFirstReview(c)) return await sendSavedResult(saved);
        warning = await notifyReview(saved, 'delivered');
        break;
      }
      case 'send-result-email':
        requireStatus(c, 'delivered');
        return await sendSavedResult(c);
      case 'reconcile':
        requireStatus(c, 'checkout', 'capturing');
        if (!c.payment_order_id) throw new ReviewError('저장된 PayPal 주문번호가 없습니다.', 409);
        saved = await captureCase(c, c.payment_order_id);
        break;
      case 'refund':
        requireStatus(c, 'paid', 'in_review', 'delivered', 'refund_requested');
        saved = await refundCase(c);
        break;
      case 'confirm-refund':
        requireStatus(c, 'refund_requested', 'refunding');
        if (c.status === 'refund_requested' && !c.refund_id) {
          throw new ReviewError('PayPal에서 대조할 기존 환불 요청이 없습니다.', 409);
        }
        saved = await refundCase(c);
        break;
      case 'decline-refund': {
        if (typeof reason !== 'string' || !reason.trim() || reason.length > 2_000) {
          throw new ReviewError('의뢰인에게 안내할 환불 거절 사유를 2,000자 이내로 입력하세요.');
        }
        if (!c.refund_requested_at || c.refund_requested_at !== refundRequestedAt || c.refund_id || c.refunded_at) {
          throw new ReviewError('현재 환불 요청과 일치하는지 확인하고 새로고침 후 다시 시도하세요.', 409);
        }

        const resolutionReason = reason.trim();
        const resumeStatus = c.delivered_at ? 'delivered' : c.started_at ? 'in_review' : 'paid';
        if (c.refund_resolved_at) {
          requireStatus(c, resumeStatus);
          if (c.refund_resolution_reason !== resolutionReason) {
            throw new ReviewError('이미 처리된 환불 요청입니다.', 409);
          }
          saved = c;
          break;
        }

        requireStatus(c, 'refund_requested');
        if (!refundRestrictionConditionsMet(c)) {
          throw new ReviewError('결제 약관 동의 기록과 환불 요청 시점의 검토 착수·결제 경과 요건을 확인할 수 없습니다.', 409);
        }
        saved = await transitionReviewCase(c, {
          status: resumeStatus,
          refund_resolved_at: new Date().toISOString(),
          refund_resolution_reason: resolutionReason,
        });
        warning = await notifyReview(saved, 'refund_declined');
        break;
      }
    }
    return reviewJson({
      case: queueCase(saved),
      ...(warning ? {warning: '사건 상태를 저장했습니다. 안내 이메일 발송은 실패했습니다.'} : {}),
    });
  } catch (error) {
    return reviewFailure(error);
  }
}

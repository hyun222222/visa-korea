'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isVisaContentAdmin } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';
import { refundRestrictionConditionsMet, type PaymentTermsLanguage } from '@/lib/visa-review-terms';
import styles from './review-admin.module.css';

type ReviewCase = {
  id: string;
  email: string;
  name: string;
  visa: string;
  plan: string;
  amount_cents: number;
  question: string;
  counterparty?: string | null;
  language: string;
  status: string;
  submitted_at?: string | null;
  paid_at?: string | null;
  deadline_at?: string | null;
  checkout_expires_at?: string | null;
  payment_order_id?: string | null;
  payment_consent?: {version: string; language: PaymentTermsLanguage; accepted_at: string; terms: string} | null;
  started_at?: string | null;
  delivered_at?: string | null;
  refund_requested_at?: string | null;
  refund_id?: string | null;
  refund_resolved_at?: string | null;
  refund_resolution_reason?: string | null;
  result?: string | null;
  notification_status?: string | null;
};

type Action = 'accept' | 'decline' | 'start' | 'deliver' | 'refund' | 'files' | 'confirm-refund' | 'decline-refund' | 'reconcile';
type ActionDetails = { result?: string; reason?: string; refundRequestedAt?: string; materialsConfirmed?: boolean };
type ReviewFile = { name: string; url: string };
type FileLinks = { files: ReviewFile[]; expiresAt: number };
type AdminResponse = {
  cases?: ReviewCase[];
  case?: ReviewCase;
  files?: ReviewFile[];
  warning?: string;
  error?: string;
};

const plans: Record<string, string> = {
  question: '질문 1건',
  documents: '요건·서류 검토',
  strategy: '복합 쟁점 검토',
};

const statuses: Record<string, string> = {
  submitted: '접수 확인 대기',
  accepted: '결제 대기',
  checkout: '결제 진행 중',
  capturing: '결제 확인 중',
  paid: '결제 완료',
  in_review: '검토 중',
  delivered: '의견 전달 완료',
  declined: '수임 불가',
  cancelled: '취소',
  refund_requested: '환불 처리 대기',
  refunding: 'PayPal 환불 처리 중',
  refunded: '환불 완료',
  expired: '결제 기한 만료',
};

const seoulTime = new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'medium',
  timeStyle: 'medium',
  timeZone: 'Asia/Seoul',
});

function displayTime(value?: string | null) {
  if (!value) return '—';
  const time = new Date(value);
  return Number.isNaN(time.getTime()) ? '—' : seoulTime.format(time);
}

function safeFileUrl(value: string) {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function displayAmount(cents: number) {
  if (!Number.isSafeInteger(cents) || cents <= 0) return null;
  return `USD ${(cents / 100).toFixed(2)}`;
}

type CardProps = {
  item: ReviewCase;
  busy: boolean;
  now: number;
  links?: FileLinks;
  onAction: (id: string, action: Action, details?: ActionDetails) => void;
};

function ReviewCard({ item, busy, now, links, onAction }: CardProps) {
  const [result, setResult] = useState('');
  const [refundAction, setRefundAction] = useState<'refund' | 'confirm-refund' | null>(null);
  const [declineRefund, setDeclineRefund] = useState<{ requestedAt: string; reason: string } | null>(null);
  const [caseConfirmation, setCaseConfirmation] = useState('');
  const [approved, setApproved] = useState(false);
  const [materialsConfirmed, setMaterialsConfirmed] = useState(false);
  const plan = plans[item.plan] ?? item.plan;
  const amount = displayAmount(item.amount_cents);
  const { status } = item;
  const canRefund = ['paid', 'in_review', 'delivered', 'refund_requested'].includes(status);
  const canConfirmRefund = status === 'refunding' || (status === 'refund_requested' && Boolean(item.refund_id));
  const canDeclineRefund = status === 'refund_requested' && !item.refund_id &&
    !item.refund_resolved_at && refundRestrictionConditionsMet(item);
  const paidAt = Date.parse(item.paid_at ?? '');
  const deliveryOpensAt = Number.isFinite(paidAt) ? paidAt + 2 * 60 * 60 * 1000 : null;
  const canDeliver = deliveryOpensAt !== null && now >= deliveryOpensAt;
  const deadlineIsActive = status === 'paid' || status === 'in_review';
  const overdue = deadlineIsActive && item.deadline_at && new Date(item.deadline_at).getTime() < now;

  function openRefund(action: 'refund' | 'confirm-refund') {
    setDeclineRefund(null);
    setCaseConfirmation('');
    setApproved(false);
    setRefundAction(action);
  }

  const activeLinks = links && links.expiresAt > now ? links : undefined;
  const canConfirmSelectedAction = refundAction === 'refund' ? canRefund : canConfirmRefund;

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h2>{item.name}</h2>
          <p className={styles.caseId}>{item.id}</p>
        </div>
        <span className={styles.status}>{statuses[status] ?? status}</span>
      </div>

      <dl className={styles.fields}>
        <div><dt>이메일</dt><dd>{item.email}</dd></div>
        <div><dt>상품</dt><dd>{plan}{amount && ` · ${amount}`}</dd></div>
        <div><dt>비자 유형 · 언어</dt><dd>{item.visa} · {item.language}</dd></div>
        <div><dt>이해관계자</dt><dd>{item.counterparty || '—'}</dd></div>
        <div><dt>접수 시각</dt><dd>{displayTime(item.submitted_at)}</dd></div>
        <div><dt>결제 시각</dt><dd>{displayTime(item.paid_at)}</dd></div>
        <div><dt>실제 검토 착수</dt><dd>{displayTime(item.started_at)}</dd></div>
        {item.delivered_at && <div><dt>결과 전달 시각</dt><dd>{displayTime(item.delivered_at)}</dd></div>}
        {item.refund_requested_at && <div><dt>환불 요청 시각</dt><dd>{displayTime(item.refund_requested_at)}</dd></div>}
        {item.refund_resolved_at && <div><dt>환불 요청 거절 시각</dt><dd>{displayTime(item.refund_resolved_at)}</dd></div>}
        {item.payment_consent && <div><dt>결제 약관 동의</dt><dd>
          <details><summary>{displayTime(item.payment_consent.accepted_at)}</summary>
            <p>{item.payment_consent.version}</p>
            <p>{item.payment_consent.terms}</p>
          </details>
        </dd></div>}
        <div><dt>회신 기한</dt><dd className={overdue ? styles.overdue : undefined}>{displayTime(item.deadline_at)}{overdue && ' · 지연'}</dd></div>
        {item.checkout_expires_at && <div><dt>결제 링크 만료</dt><dd>{displayTime(item.checkout_expires_at)}</dd></div>}
        {item.payment_order_id && <div><dt>PayPal 주문번호</dt><dd>{item.payment_order_id}</dd></div>}
        {item.refund_id && <div><dt>PayPal 환불번호</dt><dd>{item.refund_id}</dd></div>}
        {item.notification_status && <div><dt>알림 상태</dt><dd>{item.notification_status}</dd></div>}
      </dl>

      {item.question && <details className={styles.details}>
        <summary>신청 내용 보기</summary>
        <p className={styles.multiline}>{item.question}</p>
      </details>}
      {status === 'submitted' && <label className={styles.checkbox}>
        <input type="checkbox" checked={materialsConfirmed} onChange={(event) => setMaterialsConfirmed(event.target.checked)} />
        필요한 자료가 이메일에 들어왔고, 검토 범위와 이해충돌을 확인했습니다.
      </label>}
      {item.result && <details className={styles.details}>
        <summary>보관된 서면 결과</summary>
        <p className={styles.multiline}>{item.result}</p>
      </details>}
      {item.refund_resolution_reason && <details className={styles.details}>
        <summary>의뢰인에게 안내한 환불 거절 사유</summary>
        <p className={styles.multiline}>{item.refund_resolution_reason}</p>
      </details>}
      <div className={styles.actions}>
        {item.question && <button type="button" disabled={busy} onClick={() => onAction(item.id, 'files')}>이전 웹 접수 자료 링크 받기</button>}
        {status === 'submitted' && <button type="button" className={styles.primary} disabled={busy || !materialsConfirmed} onClick={() => onAction(item.id, 'accept', { materialsConfirmed })}>접수 승인 및 결제 안내</button>}
        {['submitted', 'accepted'].includes(status) && <button type="button" disabled={busy} onClick={() => onAction(item.id, 'decline')}>수임 불가 처리</button>}
        {['checkout', 'capturing'].includes(status) && <button type="button" disabled={busy} onClick={() => onAction(item.id, 'reconcile')}>PayPal 결제 상태 대조</button>}
        {status === 'paid' && <button type="button" className={styles.primary} disabled={busy} onClick={() => onAction(item.id, 'start')}>자료 확인 및 검토 착수</button>}
        {canRefund && <button type="button" disabled={busy || !amount} onClick={() => openRefund('refund')}>환불 검토</button>}
        {canConfirmRefund && <button type="button" disabled={busy || !amount} onClick={() => openRefund('confirm-refund')}>PayPal 환불 상태 대조</button>}
        {canDeclineRefund && <button type="button" disabled={busy} onClick={() => {
          if (!item.refund_requested_at) return;
          setRefundAction(null);
          setDeclineRefund({ requestedAt: item.refund_requested_at, reason: '' });
        }}>환불 요청 거절 검토</button>}
      </div>

      {status === 'refund_requested' && !item.refund_id && !canDeclineRefund && (
        <p className={styles.note}>환불 요청 시각을 기준으로 결제 확인 후 2시간 경과, 실제 착수, 결제 약관 동의 기록을 모두 확인하면 거절을 검토할 수 있습니다.</p>
      )}

      {activeLinks && (
        <section className={styles.details} aria-label="비공개 자료 링크">
          <p>링크 만료 {displayTime(new Date(activeLinks.expiresAt).toISOString())}</p>
          {activeLinks.files.length ? <ul>{activeLinks.files.map((file) => (
            <li key={file.url}><a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a></li>
          ))}</ul> : <p>등록된 자료가 없습니다.</p>}
        </section>
      )}

      {status === 'in_review' && (
        <form className={styles.form} onSubmit={(event) => {
          event.preventDefault();
          if (canDeliver && result.trim().length >= 20) onAction(item.id, 'deliver', { result: result.trim() });
        }}>
          <label>
            <span>의뢰인에게 전달할 서면 검토 결과</span>
            <textarea value={result} onChange={(event) => setResult(event.target.value)} rows={6} minLength={20} maxLength={20_000} required />
          </label>
          <p className={styles.note}>
            {deliveryOpensAt === null
              ? '결제 확인 시각을 확인해야 검토 결과를 전달할 수 있습니다.'
              : '결과 전달 가능 시각 ' + displayTime(new Date(deliveryOpensAt).toISOString()) + ' KST'}
          </p>
          <button className={styles.primary} disabled={busy || !canDeliver || result.trim().length < 20} type="submit">서면 결과 전달</button>
        </form>
      )}

      {refundAction && amount && canConfirmSelectedAction && (
        <form className={styles.refund} onSubmit={(event) => {
          event.preventDefault();
          if (!approved || caseConfirmation.trim() !== item.id) return;
          onAction(item.id, refundAction);
          setRefundAction(null);
        }}>
          <h3>{refundAction === 'refund' ? '전액 환불 실행 확인' : 'PayPal 환불 상태 대조 확인'}</h3>
          <p>사건 <strong>{item.id}</strong> · <strong>{amount}</strong></p>
          <label>
            <span>확인할 사건 번호를 그대로 입력하세요</span>
            <input value={caseConfirmation} onChange={(event) => setCaseConfirmation(event.target.value)} autoComplete="off" required />
          </label>
          <label className={styles.checkbox}>
            <input type="checkbox" checked={approved} onChange={(event) => setApproved(event.target.checked)} required />
            {refundAction === 'refund' ? '사건, 금액, 환불 사유를 확인했고 전액 환불을 승인합니다.' : '사건과 금액을 확인했고 기존 환불 요청의 재확인을 승인합니다.'}
          </label>
          <div className={styles.actions}>
            <button type="button" disabled={busy} onClick={() => setRefundAction(null)}>닫기</button>
            <button type="submit" className={styles.danger} disabled={busy || !approved || caseConfirmation.trim() !== item.id}>
              {refundAction === 'refund' ? `${amount} 환불` : '환불 상태 대조'}
            </button>
          </div>
        </form>
      )}
      {declineRefund && canDeclineRefund && declineRefund.requestedAt === item.refund_requested_at && (
        <form className={styles.refund} onSubmit={(event) => {
          event.preventDefault();
          if (!declineRefund.reason.trim()) return;
          onAction(item.id, 'decline-refund', {
            reason: declineRefund.reason.trim(), refundRequestedAt: declineRefund.requestedAt,
          });
        }}>
          <h3>환불 요청 거절</h3>
          <p>실제 검토 착수·결과 전달 시각과 약관을 확인하세요. 법정 청약철회나 환불 사유가 있는지도 확인하세요. 거절하면 사건은 환불 요청 전의 검토 단계로 돌아갑니다.</p>
          <label>
            <span>의뢰인에게 안내할 환불 거절 사유</span>
            <textarea value={declineRefund.reason} onChange={(event) => setDeclineRefund({ ...declineRefund, reason: event.target.value })} rows={4} maxLength={2_000} required />
          </label>
          <div className={styles.actions}>
            <button type="button" disabled={busy} onClick={() => setDeclineRefund(null)}>닫기</button>
            <button type="submit" className={styles.danger} disabled={busy || !declineRefund.reason.trim()}>거절 사유 저장 및 안내</button>
          </div>
        </form>
      )}
    </article>
  );
}

export default function VisaReviewAdmin() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [cases, setCases] = useState<ReviewCase[]>([]);
  const [fileLinks, setFileLinks] = useState<Record<string, FileLinks>>({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now);
  const auth = useRef<{ epoch: number; uid?: string | null; allowed: boolean }>({ epoch: 0, allowed: false });
  const inFlight = useRef<number | null>(null);

  const relevant = useCallback((epoch: number) => auth.current.epoch === epoch && auth.current.allowed, []);

  const request = useCallback(async (epoch: number, payload?: { caseId: string; action: Action } & ActionDetails) => {
    if (!relevant(epoch)) throw new Error('관리자 로그인을 다시 확인하세요.');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !relevant(epoch) || session.user.id !== auth.current.uid) {
      throw new Error('로그인 계정이 변경되었습니다.');
    }
    const response = await fetch('/api/visa-review/admin', {
      method: payload ? 'POST' : 'GET',
      cache: 'no-store',
      headers: { Authorization: `Bearer ${session.access_token}`, ...(payload ? { 'Content-Type': 'application/json' } : {}) },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
    });
    const body: AdminResponse = await response.json().catch(() => ({}));
    if (!relevant(epoch)) throw new Error('로그인 계정이 변경되었습니다.');
    if (!response.ok) throw new Error(body.error || '요청을 처리할 수 없습니다.');
    return body;
  }, [relevant]);

  const run = useCallback(async (operation: (epoch: number) => Promise<void>, epoch = auth.current.epoch) => {
    if (!relevant(epoch) || inFlight.current === epoch) return;
    inFlight.current = epoch;
    setBusy(true);
    setMessage('');
    setError('');
    try {
      await operation(epoch);
    } catch (caught) {
      if (relevant(epoch)) setError(caught instanceof Error ? caught.message : '요청을 처리할 수 없습니다.');
    } finally {
      if (inFlight.current === epoch) inFlight.current = null;
      if (relevant(epoch)) setBusy(false);
    }
  }, [relevant]);

  const load = useCallback(async (epoch: number) => {
    const response = await request(epoch);
    if (relevant(epoch)) setCases(response.cases ?? []);
  }, [relevant, request]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let disposed = false;
    let sawAuthEvent = false;

    function updateAuthorization(uid: string | null) {
      if (disposed || auth.current.uid === uid) return;
      const epoch = auth.current.epoch + 1;
      auth.current = { epoch, uid, allowed: false };
      setAllowed(uid ? null : false);
      setCases([]);
      setFileLinks({});
      setMessage('');
      setError('');
      setBusy(false);
      if (!uid) return;

      // Wait until Supabase's subscriber has returned before getting the session again.
      window.setTimeout(async () => {
        if (disposed || auth.current.epoch !== epoch) return;
        const ok = await isVisaContentAdmin();
        if (disposed || auth.current.epoch !== epoch) return;
        auth.current.allowed = ok;
        setAllowed(ok);
        if (ok) await run(load, epoch);
      }, 0);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      sawAuthEvent = true;
      updateAuthorization(session?.user.id ?? null);
    });
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!sawAuthEvent) updateAuthorization(session?.user.id ?? null);
    }).catch(() => {
      if (!sawAuthEvent) updateAuthorization(null);
    });

    return () => {
      disposed = true;
      auth.current = { epoch: auth.current.epoch + 1, allowed: false };
      subscription.unsubscribe();
    };
  }, [load, run]);

  function action(caseId: string, command: Action, details?: ActionDetails) {
    void run(async (epoch) => {
      const response = await request(epoch, { caseId, action: command, ...details });
      if (!relevant(epoch)) return;
      if (command === 'files') {
        const files = (response.files ?? []).filter((file) => safeFileUrl(file.url));
        const fetchedAt = Date.now();
        const links = { files, expiresAt: fetchedAt + 60_000 };
        setNow(fetchedAt);
        setFileLinks((previous) => ({ ...previous, [caseId]: links }));
        window.setTimeout(() => {
          if (!relevant(epoch)) return;
          setFileLinks((previous) => {
            if (previous[caseId] !== links) return previous;
            const retained = { ...previous };
            delete retained[caseId];
            return retained;
          });
        }, 60_000);
        return;
      }
      const updated = response.case;
      if (updated) setCases((previous) => previous.map((item) => item.id === updated.id ? updated : item));
      else await load(epoch);
      if (relevant(epoch)) setMessage(response.warning || '사건 상태를 갱신했습니다.');
    });
  }

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <h1>비자 서면검토 관리</h1>
        {allowed && <button type="button" disabled={busy} onClick={() => void run(load)}>{busy ? '처리 중…' : '새로고침'}</button>}
      </header>
      {allowed === null && <p role="status">관리자 권한을 확인하고 있습니다.</p>}
      {allowed === false && <p><Link href="/admin" target="_blank" rel="noopener noreferrer">사무소 관리자 로그인</Link> 후 이 화면으로 돌아오세요.</p>}
      {allowed && <>
        <p className={styles.note}>표시 시각은 한국시간(KST)입니다.</p>
        {message && <p role="status">{message}</p>}
        {error && <p role="alert" className={styles.overdue}>{error}</p>}
        {!busy && !error && !cases.length && <p>접수된 사건이 없습니다.</p>}
        <div className={styles.cases}>
          {cases.map((item) => <ReviewCard key={item.id} item={item} busy={busy} now={now} links={fileLinks[item.id]} onAction={action} />)}
        </div>
      </>}
    </section>
  );
}

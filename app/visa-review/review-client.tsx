'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { paymentTerms, paymentTermsVersion } from '@/lib/visa-review-terms';
import { copy, plans, planPrice, type Language, type Plan, type Status } from './review-copy';
import ReviewDiagnosis from './review-diagnosis';
import DirectReview, {type DirectSession} from './review-direct';
import {request} from './review-request';
import ReviewSituations from './review-situations';
import styles from './review.module.css';
import {reviewMarketPath} from '@/lib/visa-review-locales';
import {koreanReviewTopicUrl} from '@/lib/visa-review-ko-topics';

export type Case = {
  id: string;
  plan: Plan;
  amountCents: number;
  status: Status;
  payFirst?: boolean;
  deadlineAt?: string | null;
  result?: string | null;
  paidAt?: string | null;
  materialsSubmittedAt?: string | null;
  checkoutExpiresAt?: string | null;
  agreement?: string;
  refundDecision?: {resolvedAt: string; reason: string} | null;
};

type Snapshot = DirectSession & {cases: Case[]; open: boolean; authenticated?: boolean; paypalClientId?: string | null; materialsSubmissionEnabled?: boolean};
type Props = { language: Language; initialPlan: Plan; businessRegistrationNumber: string | null; caseOnReturn?: string; orderOnReturn?: string; cancelledOnReturn: boolean };
type Notice = { kind: 'error' | 'message'; text: string };
type CheckoutConsent = {
  koreanLaw: boolean;
  immediateReviewAndRefund: boolean;
  noVisaGuarantee: boolean;
};

const statusBeforePayment = new Set<Status>(['submitted', 'accepted', 'checkout']);
const statusAfterPayment = new Set<Status>(['paid', 'in_review', 'delivered']);
const locale: Record<Language, string> = { en: 'en-US', ko: 'ko-KR', zh: 'zh-CN' };

function formatDeadline(date: string, language: Language) {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return null;
  return new Intl.DateTimeFormat(locale[language], {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Seoul',
  }).format(value) + ' KST';
}

function checkPaymentUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || !['paypal.com', 'www.paypal.com', 'sandbox.paypal.com', 'www.sandbox.paypal.com'].includes(url.hostname)) {
    throw new Error();
  }
  return url.toString();
}

function openNotice(id: string) {
  const details = document.getElementById(id);
  if (details instanceof HTMLDetailsElement) details.open = true;
}

function CheckoutForm({ language, amountCents, payFirst, busy, paying, onPay }: {
  language: Language;
  amountCents: number;
  payFirst?: boolean;
  busy: boolean;
  paying: boolean;
  onPay: (consent: CheckoutConsent) => void;
}) {
  const t = copy[language];
  const terms = paymentTerms[language];
  const [consent, setConsent] = useState<CheckoutConsent>({
    koreanLaw: false,
    immediateReviewAndRefund: false,
    noVisaGuarantee: false,
  });
  const ready = consent.koreanLaw && consent.immediateReviewAndRefund && consent.noVisaGuarantee;
  const fields = [
    ['koreanLaw', terms.governingLaw],
    ['immediateReviewAndRefund', terms.startAndRefund],
    ['noVisaGuarantee', terms.noGuarantee],
  ] as const;

  function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (ready && !busy && event.currentTarget.checkValidity()) onPay(consent);
  }

  return (
    <form className={styles.paymentForm} onSubmit={submitPayment}>
      <fieldset className={styles.paymentTerms} disabled={busy}>
        <legend>{terms.title}</legend>
        {payFirst && <p>{t.payFirstNotice}</p>}
        <p className={styles.paymentOutcome}><strong>{t.outcomeTitle}</strong></p>
        <p>{t.basedOnProvidedFacts}</p>
        <p>{t.minorNotice}</p>
        <p>{terms.attention}</p>
        <a className={styles.textButton} href="#review-agreement" onClick={() => {
          openNotice('review-agreement');
          openNotice('review-refunds');
        }}>{t.scopeTitle} · {t.refundTitle}</a>
        {fields.map(([field, label]) => (
          <label key={field} className={styles.check}>
            <input
              type="checkbox"
              name={field}
              required
              checked={consent[field]}
              onChange={(event) => {
                const checked = event.target.checked;
                setConsent((current) => ({...current, [field]: checked}));
              }}
            />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
      <button type="submit" className={styles.primary} disabled={!ready || busy} aria-busy={paying}>
        {paying ? t.working : t.pay + ' · $' + (amountCents / 100).toFixed(2) + ' USD'}
      </button>
    </form>
  );
}

export default function ReviewClient({ language, initialPlan, businessRegistrationNumber, caseOnReturn, orderOnReturn, cancelledOnReturn }: Props) {
  const t = copy[language];
  const terms = paymentTerms[language];
  const [plan, setPlan] = useState(initialPlan);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [needCode, setNeedCode] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [transferConsent, setTransferConsent] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const busyRef = useRef(false);
  const [notice, setNotice] = useState<Notice | null>(cancelledOnReturn ? {kind: 'message', text: t.returnCancel} : null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [returnedChecked, setReturnedChecked] = useState(false);
  const startedCapture = useRef(false);
  const currentCase = snapshot?.cases.find((item) => item.id === caseOnReturn);
  const directReturn = Boolean(caseOnReturn && snapshot?.directCase?.id === caseOnReturn);
  const alreadyPaid = currentCase && (statusAfterPayment.has(currentCase.status) || currentCase.status === 'refund_requested' || currentCase.status === 'refunded');
  const needsReturnCheck = authenticated && caseOnReturn && orderOnReturn && !directReturn && !returnedChecked && !cancelledOnReturn && !alreadyPaid;
  const needsDirectReturnCheck = directReturn && !returnedChecked && !cancelledOnReturn && !!orderOnReturn &&
    snapshot?.directOrderId === orderOnReturn && snapshot.directCase?.status === 'checkout';

  const refresh = useCallback(async () => {
    const state = await request<Snapshot>();
    setSnapshot(state);
    setAuthenticated((known) => state.authenticated ?? (known || state.cases.length > 0));
    setLoadFailed(false);
    return state;
  }, []);

  const updateDirectSession = useCallback((session: DirectSession) => {
    setSnapshot((current) => current && {...current, ...session});
  }, []);

  useEffect(() => {
    void refresh().catch(() => setLoadFailed(true));
  }, [refresh]);

  const action = useCallback(async (name: string, work: () => Promise<void>) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(name);
    setNotice(null);
    try {
      await work();
    } catch (error) {
      setNotice({kind: 'error', text: error instanceof Error && error.message ? error.message : t.genericError});
    } finally {
      busyRef.current = false;
      setBusy(null);
    }
  }, [t.genericError]);

  const confirmReturnedPayment = useCallback(() => {
    if (!caseOnReturn || !orderOnReturn || cancelledOnReturn) return;
    if (directReturn && !needsDirectReturnCheck) return;
    void action('capture', async () => {
      const {case: paidCase, materialsToken} = await request<{case: Case; materialsToken?: string | null}>({
        action: directReturn ? 'confirm-existing-direct-payment' : 'capture', caseId: caseOnReturn, orderId: orderOnReturn,
      });
      if (directReturn) {
        updateDirectSession({directCase: paidCase, directOrderId: orderOnReturn, materialsToken: materialsToken ?? null});
      } else {
        setSnapshot((existing) => existing && {...existing, cases: existing.cases.map((item) => item.id === paidCase.id ? paidCase : item)});
      }
      setReturnedChecked(true);
      const clean = new URL(window.location.href);
      ['reviewCase', 'token', 'PayerID', 'cancelled'].forEach((key) => clean.searchParams.delete(key));
      clean.hash = directReturn ? 'apply' : 'cases';
      window.history.replaceState(window.history.state, '', clean);
      setNotice({kind: 'message', text: directReturn ? t.directPaid : paidCase.payFirst ? t.payFirstPaid : t.paid});
      document.getElementById(directReturn ? 'apply' : 'cases')?.scrollIntoView();
      await refresh().catch(() => setLoadFailed(true));
    });
  }, [action, cancelledOnReturn, caseOnReturn, directReturn, needsDirectReturnCheck, orderOnReturn, refresh, t.directPaid, t.paid, t.payFirstPaid, updateDirectSession]);

  useEffect(() => {
    if ((!needsReturnCheck && !needsDirectReturnCheck) || busy || startedCapture.current) return;
    const timer = window.setTimeout(() => {
      startedCapture.current = true;
      confirmReturnedPayment();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [busy, confirmReturnedPayment, needsDirectReturnCheck, needsReturnCheck]);

  function selectPlan(selected: Plan) {
    setPlan(selected);
  }

  function sendCode(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!privacyConsent || !transferConsent) return;
    void action('send-code', async () => {
      await request({action: 'send-code', email, privacyConsent, transferConsent, language});
      setNeedCode(true);
      setCode('');
      setNotice({kind: 'message', text: t.codeSent});
    });
  }

  function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void action('verify-code', async () => {
      await request({action: 'verify-code', email, code});
      setAuthenticated(true);
      setNotice({kind: 'message', text: t.verified});
      await refresh().catch(() => setLoadFailed(true));
    });
  }

  function pay(item: Case, consent: CheckoutConsent) {
    void action(item.id, async () => {
      const { approvalUrl } = await request<{approvalUrl: string}>({
        action: 'checkout',
        caseId: item.id,
        language,
        termsVersion: paymentTermsVersion,
        ...consent,
      });
      window.location.assign(checkPaymentUrl(approvalUrl));
    });
  }

  function cancel(item: Case) {
    if (!window.confirm(t.confirmation)) return;
    void action(item.id, async () => {
      await request({action: 'cancel', caseId: item.id});
      setNotice({kind: 'message', text: t.cancelled});
      await refresh();
    });
  }

  function languageHref(target: Language) {
    const params = new URLSearchParams({ lang: target, plan });
    if (caseOnReturn && !returnedChecked) params.set('reviewCase', caseOnReturn);
    if (orderOnReturn && !returnedChecked) params.set('token', orderOnReturn);
    if (cancelledOnReturn) params.set('cancelled', '1');
    return '?' + params.toString();
  }

  return (
    <div className={styles.site} lang={language === 'zh' ? 'zh-CN' : language}>
      <div className={styles.masthead}>
        <div className={styles.container}>
          <a className={styles.firm} href="#"><strong>{t.firm}</strong></a>
          <nav className={styles.utility} aria-label={t.languageLabel}>
            <a href="#cases" onClick={() => openNotice('cases')}>{t.casesLink}</a>
            <a href={reviewMarketPath(language === 'zh' ? 'zh' : 'en')}>{language === 'ko' ? '해외 고객 안내' : language === 'zh' ? '其他语言' : 'Other languages'}</a>
            {language === 'ko' && <a href={koreanReviewTopicUrl('visa-status-check')}>체류자격별 안내</a>}
            <span className={styles.language}>
              {([['en', 'English'], ['ko', '한국어'], ['zh', '简体中文']] as const).map(([key, label]) => (
                <a key={key} href={languageHref(key)} lang={key === 'zh' ? 'zh-CN' : key} aria-current={key === language ? 'page' : undefined}>{label}</a>
              ))}
            </span>
          </nav>
        </div>
      </div>

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{t.office}</p>
            <h1>{t.heroTitle}</h1>
            <p className={styles.lead}>{t.heroBody}</p>
            <a className={styles.primary} href="#diagnosis">{t.primary} <span aria-hidden="true">↓</span></a>
            <p className={styles.heroNote}>{t.clock}</p>
            <p className={styles.heroNote}><strong>{t.outcomeTitle}</strong> {t.outcome}</p>
          </div>
          <aside className={styles.sample} aria-label={t.sampleTitle}>
            <p className={styles.sampleTitle}>{t.sampleTitle}</p>
            <h2>{t.sampleCase}</h2>
            <p>{t.sampleBody}</p>
            <p className={styles.sampleNext}>{t.sampleNext}</p>
          </aside>
        </div>
      </section>

      <ReviewSituations language={language} onChoose={selectPlan} />
      <ReviewDiagnosis language={language} onRecommend={selectPlan} />

      <section id="plans" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionIntro}><h2>{t.planTitle}</h2><p>{t.planIntro}</p></div>
          <div className={styles.plans}>
            {plans.map((key) => (
              <article className={styles.plan} data-featured={key === 'question'} key={key}>
                <h3>{t.plan[key].title}</h3>
                <p className={styles.price}>${planPrice[key]} <small>USD</small></p>
                <p>{t.plan[key].scope}</p>
                <p className={styles.planOutcome}>{t.plan[key].result}</p>
                <a href="#apply" className={key === 'question' ? styles.primary : styles.secondary} onClick={() => selectPlan(key)} aria-label={t.choose + ' · ' + t.plan[key].title}>{t.choose}</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.process}>
        <div className={styles.container}>
          <h2>{t.processTitle}</h2>
          <ol>
            {t.process.map(([title, body]) => <li key={title}><h3>{title}</h3><p>{body}</p></li>)}
          </ol>
        </div>
      </section>

      <div className={styles.container}>
        <div className={styles.workbench}>
          {snapshot ? <DirectReview
            language={language} plan={plan} clientId={snapshot.open ? snapshot.paypalClientId ?? null : null}
            materialsEnabled={snapshot.materialsSubmissionEnabled === true}
            session={{directCase: snapshot.directCase, directOrderId: snapshot.directOrderId, materialsToken: snapshot.materialsToken}}
            onSession={updateDirectSession}
          /> : <section className={styles.formPanel} id="apply">
            <h2>{t.application}</h2>
            <p className={styles.selected}>{t.plan[plan].title} <strong>${planPrice[plan]} USD</strong></p>
            <p role={loadFailed ? 'alert' : 'status'} className={styles.notice}>{loadFailed ? t.initError : t.working}</p>
            {loadFailed && <button type="button" className={styles.textButton} onClick={() => void action('refresh', async () => { await refresh(); })}>{t.reload}</button>}
          </section>}

          <details className={styles.casePanel} id="cases" aria-busy={!!busy} open={Boolean(caseOnReturn && !directReturn)}>
            <summary>{t.casesTitle}</summary>
            <p>{t.casesIntro}</p>
            {notice && <p className={styles.notice} role={notice.kind === 'error' ? 'alert' : 'status'}>{notice.text}</p>}
            {!authenticated && (
              <>
                <h3>{t.verifyTitle}</h3>
                <p>{t.verifyBody}</p>
                {needCode ? (
                  <form className={styles.form} onSubmit={verifyCode}>
                    <label>{t.email}<input type="email" name="email" autoComplete="email" value={email} onChange={(event) => {setEmail(event.target.value);setNeedCode(false);}} required /></label>
                    <label>{t.code}<input name="code" value={code} onChange={(event) => setCode(event.target.value)} autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required /></label>
                    <button className={styles.primary} disabled={!!busy} type="submit">{busy === 'verify-code' ? t.working : t.verify}</button>
                    <button className={styles.textButton} type="button" disabled={!!busy} onClick={() => sendCode()}>{t.resend}</button>
                  </form>
                ) : (
                  <form className={styles.form} onSubmit={sendCode}>
                    <label>{t.email}<input type="email" name="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={254} required /></label>
                    <label className={styles.check}><input type="checkbox" checked={privacyConsent} onChange={(event) => setPrivacyConsent(event.target.checked)} required />{t.privacyConsent}</label>
                    <label className={styles.check}><input type="checkbox" checked={transferConsent} onChange={(event) => setTransferConsent(event.target.checked)} required />{t.transferConsent}</label>
                    <a className={styles.textButton} href="#privacy">{t.privacyTitle}</a>
                    <button className={styles.primary} disabled={!!busy} type="submit">{busy === 'send-code' ? t.working : t.sendCode}</button>
                  </form>
                )}
              </>
            )}
            {authenticated && <button className={styles.textButton} type="button" disabled={!!busy} onClick={() => void action('refresh', async () => { await refresh(); })}>{busy === 'refresh' ? t.working : t.reload}</button>}
            {needsReturnCheck && <button type="button" className={styles.secondary} disabled={!!busy} onClick={confirmReturnedPayment}>{busy === 'capture' ? t.working : t.returnRetry}</button>}
            {authenticated && !snapshot?.cases.length && <p className={styles.quiet}>{t.emptyCases}</p>}
            {snapshot?.cases.map((item) => {
              const deadline = item.deadlineAt ? formatDeadline(item.deadlineAt, language) : null;
              const newUnpaid = item.payFirst && item.status === 'submitted';
              const awaitingPayment = newUnpaid || item.status === 'accepted' || item.status === 'checkout';
              const paymentExpired = awaitingPayment && !(Date.parse(item.checkoutExpiresAt ?? '') > Date.now());
              const canPay = authenticated && snapshot.open && !item.payFirst && awaitingPayment && !paymentExpired && !(needsReturnCheck && item.id === caseOnReturn);
              const awaitingMaterials = item.payFirst && item.status === 'paid';
              return (
                <article key={item.id} className={styles.case}>
                  <p className={styles.state}>{awaitingMaterials ? t.paidAwaitingMaterials : t.status[newUnpaid ? 'checkout' : item.status]}</p>
                  <h3>{t.plan[item.plan].title}</h3>
                  <p className={styles.caseReference}>{t.reference} <code>{item.id}</code></p>
                  {deadline && <p>{t.due} <strong>{deadline}</strong></p>}
                  {item.status === 'submitted' && !item.payFirst && <>
                    <p>{t.accepted}</p>
                    <p>{t.emailMaterialsDetail}</p>
                    <p className={styles.quiet}>{t.mask}</p>
                  </>}
                  {awaitingMaterials && <>
                    <p className={styles.notice}>{t.emailMaterialsDetail}</p>
                    <p className={styles.quiet}>{t.mask}</p>
                  </>}
                  {(item.status === 'in_review' || (item.status === 'paid' && !item.payFirst)) && <p>{t.requestPending}</p>}
                  {item.refundDecision && <div className={styles.notice}>
                    <strong>{t.refundDeclined}</strong>
                    <p className={styles.refundReason}>{item.refundDecision.reason}</p>
                  </div>}
                  {paymentExpired && <p className={styles.notice}>{t.checkoutExpired}</p>}
                  {canPay && <CheckoutForm language={language} amountCents={item.amountCents} payFirst={item.payFirst} busy={!!busy} paying={busy === item.id} onPay={(consent) => pay(item, consent)} />}
                  {(statusBeforePayment.has(item.status) || statusAfterPayment.has(item.status)) && <button type="button" className={styles.textButton} disabled={!!busy} onClick={() => cancel(item)}>{statusBeforePayment.has(item.status) ? t.cancel : t.refund}</button>}
                  {item.result && <details className={styles.result}><summary>{t.result}</summary><p>{item.result}</p></details>}
                  {item.agreement && <details className={styles.result}><summary>{t.scopeTitle}</summary><p>{item.agreement}</p></details>}
                </article>
              );
            })}
          </details>
        </div>

        <section className={styles.terms} id="terms">
          <details id="review-agreement"><summary>{t.scopeTitle}</summary><p>{t.scopeText}</p><p>{t.clock}</p><p><strong>{t.outcomeTitle}</strong> {t.outcome}</p></details>
          <details id="review-refunds"><summary>{t.refundTitle}</summary><p>{terms.refundPolicy}</p><p>{t.refundInstructions}</p><p><a href={`/refund-policy?lang=${language}`}>{t.refundTitle}</a></p></details>
          <details id="privacy"><summary>{t.privacyTitle}</summary>
            <p>{t.privacyController}</p><p>{t.privacyProcessing}</p><p>{t.retention}</p>
            <dl>{t.providers.map(([name, purpose, href]) => <div key={name}><dt><a href={href} rel="noreferrer">{name}</a></dt><dd>{purpose}</dd></div>)}</dl>
            <p>{t.privacyRefusal}</p>
          </details>
        </section>
        <footer className={styles.footer}>
          <strong>김현정 법률사무소</strong>
          <span>{t.representative}</span>
          <span>{t.businessNumber} {businessRegistrationNumber ?? t.businessNumberPending}</span>
          <span>서울특별시 서초구 법원로 16, 정곡빌딩 동관 502호</span>
          <span>{t.forward} <a aria-label={t.emailUs} href="mailto:info@kimnhyun.com">info@kimnhyun.com</a> · <a href="tel:+82234777600">+82 2 3477 7600</a></span>
          <a href={`/refund-policy?lang=${language}`}>{t.refundTitle}</a>
        </footer>
      </div>
    </div>
  );
}

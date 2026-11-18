'use client';

import Script from 'next/script';
import {useEffect, useRef, useState, type FormEvent, type MouseEvent} from 'react';
import {paymentTerms, paymentTermsVersion} from '@/lib/visa-review-terms';
import {copy, planPrice, type Language, type Plan} from './review-copy';
import type {Case} from './review-client';
import {request} from './review-request';
import styles from './review.module.css';

type PayPalCallbacks = {
  createOrder: () => Promise<string>;
  onApprove: (data: {orderID: string}) => Promise<void>;
  onCancel: () => void;
  onError: () => void;
};

type PayPalSdk = {
  Buttons: (options: PayPalCallbacks & {fundingSource: string}) => {
    isEligible: () => boolean;
    render: (target: HTMLElement) => Promise<void>;
    close: () => Promise<void>;
  };
  FUNDING: {PAYPAL: string};
};

export type DirectSession = {
  directCase: Case | null;
  directOrderId: string | null;
  materialsToken: string | null;
};

type Notice = {kind: 'error' | 'message'; text: string};

const locale: Record<Language, string> = {en: 'en_US', ko: 'ko_KR', zh: 'zh_CN'};
const allowedTypes = new Set(['application/pdf', 'image/jpeg', 'image/png']);
const maxFileBytes = 4_000_000;
const maxFiles = 5;

function PayPalButtons({clientId, language, createOrder, onApprove, onCancel, onError}: PayPalCallbacks & {clientId: string; language: Language}) {
  const mount = useRef<HTMLDivElement>(null);
  const callbacks = useRef({createOrder, onApprove, onCancel, onError});
  const [sdkReady, setSdkReady] = useState(false);
  const query = new URLSearchParams({'client-id': clientId, currency: 'USD', components: 'buttons', intent: 'capture', locale: locale[language]});

  useEffect(() => {
    callbacks.current = {createOrder, onApprove, onCancel, onError};
  }, [createOrder, onApprove, onCancel, onError]);

  useEffect(() => {
    const sdk = (window as Window & {visaReviewPayPal?: PayPalSdk}).visaReviewPayPal;
    const target = mount.current;
    if (!sdkReady || !target) return;
    if (!sdk) {
      callbacks.current.onError();
      return;
    }
    const buttons = sdk.Buttons({
      fundingSource: sdk.FUNDING.PAYPAL,
      createOrder: () => callbacks.current.createOrder(),
      onApprove: (data) => callbacks.current.onApprove(data),
      onCancel: () => callbacks.current.onCancel(),
      onError: () => callbacks.current.onError(),
    });
    let disposed = false;
    if (buttons.isEligible()) {
      void buttons.render(target).catch(() => { if (!disposed) callbacks.current.onError(); });
    } else {
      callbacks.current.onError();
    }
    return () => {
      disposed = true;
      void buttons.close().catch(() => {});
    };
  }, [sdkReady]);

  return <>
    <Script id="visa-review-paypal-sdk" src={'https://www.paypal.com/sdk/js?' + query.toString()} data-namespace="visaReviewPayPal" onReady={() => setSdkReady(true)} onError={onError} />
    <div ref={mount} aria-label={copy[language].pay} />
  </>;
}

function stamp(value: string, language: Language) {
  return new Intl.DateTimeFormat(locale[language].replace('_', '-'), {dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Seoul'}).format(new Date(value)) + ' KST';
}

function openTerms(event: MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById(event.currentTarget.hash.slice(1));
  if (target instanceof HTMLDetailsElement) target.open = true;
}

export default function DirectReview({language, plan, clientId, materialsEnabled, session, onSession}: {
  language: Language;
  plan: Plan;
  clientId: string | null;
  materialsEnabled: boolean;
  session: DirectSession;
  onSession: (state: DirectSession) => void;
}) {
  const t = copy[language];
  const terms = paymentTerms[language];
  const form = useRef<HTMLFormElement>(null);
  const pending = useRef<{caseId: string; orderId: string} | null>(null);
  const inFlight = useRef(false);
  const [waiting, setWaiting] = useState(false);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [checkoutStartedHere, setCheckoutStartedHere] = useState(false);
  const activeCase = showNew ? null : session.directCase;
  const recoveryOrder = !checkoutStartedHere && activeCase?.status === 'checkout' && session.directOrderId
    ? {caseId: activeCase.id, orderId: session.directOrderId}
    : null;
  const checkoutCase = activeCase && (activeCase.paidAt || recoveryOrder || checkoutStartedHere) ? activeCase : null;
  const selectedPlan = checkoutCase?.plan ?? plan;
  const paymentReady = Boolean(clientId);
  const canSend = activeCase?.status === 'paid' && !activeCase.materialsSubmittedAt;
  const fields = [
    ['koreanLaw', terms.governingLaw],
    ['immediateReviewAndRefund', terms.startAndRefund],
    ['noVisaGuarantee', terms.noGuarantee],
    ['privacyConsent', t.privacyConsent],
    ['transferConsent', t.transferConsent],
  ] as const;

  function setPaymentWaiting(value: boolean) {
    inFlight.current = value;
    setWaiting(value);
  }

  function failure(text: string) {
    setNotice({kind: 'error', text});
  }

  async function createOrder() {
    const paymentForm = form.current;
    if (inFlight.current || !paymentForm?.reportValidity()) throw new Error();
    const data = new FormData(paymentForm);
    setPaymentWaiting(true);
    setNotice(null);
    try {
      const created = await request<{case: Case; orderId: string}>({
        action: 'create-direct-order', plan, language, email: data.get('email'), termsVersion: paymentTermsVersion,
        koreanLaw: data.has('koreanLaw'), immediateReviewAndRefund: data.has('immediateReviewAndRefund'), noVisaGuarantee: data.has('noVisaGuarantee'),
        privacyConsent: data.has('privacyConsent'), transferConsent: data.has('transferConsent'),
      });
      pending.current = {caseId: created.case.id, orderId: created.orderId};
      setCheckoutStartedHere(true);
      onSession({directCase: created.case, directOrderId: created.orderId, materialsToken: null});
      setShowNew(false);
      return created.orderId;
    } catch (error) {
      setPaymentWaiting(false);
      failure(t.directPaymentError);
      throw error;
    }
  }

  async function resumeOrder() {
    if (inFlight.current || !recoveryOrder) throw new Error();
    pending.current = recoveryOrder;
    setPaymentWaiting(true);
    setNotice(null);
    return recoveryOrder.orderId;
  }

  async function captureOrder(caseId: string, orderId: string) {
    setPaymentWaiting(true);
    setNotice(null);
    try {
      const result = await request<{case: Case; materialsToken: string | null}>({action: 'capture-direct-order', caseId, orderId});
      onSession({directCase: result.case, directOrderId: orderId, materialsToken: result.materialsToken});
      pending.current = null;
      setFallback(false);
      setCheckoutStartedHere(false);
      setReady(false);
      setNotice({kind: 'message', text: t.directPaid});
    } catch {
      setCheckoutStartedHere(false);
      failure(t.directCaptureError);
    } finally {
      setPaymentWaiting(false);
    }
  }

  function cancelPayment() {
    setPaymentWaiting(false);
    setCheckoutStartedHere(false);
    setNotice({kind: 'message', text: t.returnCancel});
  }

  function paymentError() {
    setPaymentWaiting(false);
    setCheckoutStartedHere(false);
    failure(t.directPaymentError);
  }

  async function onApprove({orderID}: {orderID: string}) {
    const order = pending.current;
    if (!order || order.orderId !== orderID) {
      setPaymentWaiting(false);
      failure(t.directCaptureError);
      return;
    }
    await captureOrder(order.caseId, order.orderId);
  }

  async function sendMaterials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend || !session.materialsToken || inFlight.current) return;
    const data = new FormData(event.currentTarget);
    const files = data.getAll('files').filter((item): item is File => item instanceof File && item.size > 0);
    if (files.length > maxFiles || files.some((file) => !allowedTypes.has(file.type)) || files.reduce((sum, file) => sum + file.size, 0) > maxFileBytes) {
      failure(t.directFilesInvalid);
      return;
    }
    data.delete('files');
    for (const file of files) data.append('files', file);
    data.set('caseId', activeCase.id);
    data.set('token', session.materialsToken);
    setPaymentWaiting(true);
    setNotice(null);
    try {
      const result = await request<{case: Case}>(data);
      onSession({...session, directCase: result.case, materialsToken: null});
      setFallback(false);
      setNotice({kind: 'message', text: t.directMaterialsSent});
    } catch {
      setFallback(true);
      failure(t.directMaterialsFailed);
    } finally {
      setPaymentWaiting(false);
    }
  }

  async function copyReference(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      setNotice({kind: 'message', text: t.directReferenceCopied});
    } catch {
      failure(t.directReferenceCopyFailed);
    }
  }

  async function requestCancellation(id: string) {
    if (inFlight.current || !window.confirm(t.confirmation)) return;
    setPaymentWaiting(true);
    setNotice(null);
    try {
      const result = await request<{case: Case}>({action: 'cancel', caseId: id});
      onSession({directCase: result.case, directOrderId: null, materialsToken: null});
      setCheckoutStartedHere(false);
      setReady(false);
      setNotice({kind: 'message', text: t.cancelled});
    } catch {
      failure(t.genericError);
    } finally {
      setPaymentWaiting(false);
    }
  }

  const paid = Boolean(activeCase?.paidAt);

  return (
    <section className={styles.formPanel} id="apply" aria-busy={waiting}>
      <h2>{paid ? t.directAfterPayment : t.application}</h2>
      <p className={styles.selected}>{t.plan[selectedPlan].title} <strong>${checkoutCase ? (checkoutCase.amountCents / 100).toFixed(2) : planPrice[plan]} USD</strong></p>
      {notice && <p className={styles.notice} role={notice.kind === 'error' ? 'alert' : 'status'}>{notice.text}</p>}
      {activeCase?.paidAt ? <>
        <p className={styles.caseReference}>{t.reference} <code>{activeCase.id}</code></p>
        <p>{t.directPaidAt} <strong>{stamp(activeCase.paidAt, language)}</strong></p>
        {activeCase.deadlineAt && <p>{t.due} <strong>{stamp(activeCase.deadlineAt, language)}</strong></p>}
        {!canSend && <p>{activeCase.materialsSubmittedAt && activeCase.status === 'paid' ? t.directMaterialsSent : t.status[activeCase.status]}</p>}
        {canSend && materialsEnabled && session.materialsToken && <form className={styles.form} onSubmit={sendMaterials}>
          <p>{t.directMaterialsIntro}</p>
          <label>{t.name}<input name="name" autoComplete="name" maxLength={120} required disabled={waiting} /></label>
          <label>{t.directQuestion}<textarea name="question" rows={5} maxLength={activeCase.plan === 'question' ? 600 : 6000} required disabled={waiting} /></label>
          <label>{t.directFiles}<input type="file" name="files" multiple accept="application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png" disabled={waiting} /><small>{t.directFileLimits}</small></label>
          <p className={styles.quiet}>{t.directMask}</p>
          <button type="submit" className={styles.primary} disabled={waiting}>{waiting ? t.working : t.directSendMaterials}</button>
        </form>}
        {canSend && (fallback || !materialsEnabled || !session.materialsToken) && <div className={styles.notice}>
          <p>{t.directFallback}</p>
          <button type="button" className={styles.textButton} onClick={() => void copyReference(activeCase.id)}>{t.directCopyReference}</button>
          {' · '}
          <a className={styles.textButton} href={'mailto:info@kimnhyun.com?subject=' + encodeURIComponent('Visa review / ' + activeCase.id)}>{t.emailUs}</a>
        </div>}
        {['paid', 'in_review', 'delivered'].includes(activeCase.status) && <button type="button" className={styles.textButton} disabled={waiting} onClick={() => void requestCancellation(activeCase.id)}>{t.refund}</button>}
      </> : activeCase && recoveryOrder ? <>
        <p className={styles.caseReference}>{t.reference} <code>{activeCase.id}</code></p>
        <p>{t.directResumePayment}</p>
        {clientId && Date.parse(activeCase.checkoutExpiresAt ?? '') > Date.now() && <PayPalButtons clientId={clientId} language={language} createOrder={resumeOrder} onApprove={onApprove} onCancel={cancelPayment} onError={paymentError} />}
        <div className={styles.directActions}>
          <button type="button" className={styles.textButton} disabled={waiting} onClick={() => void captureOrder(recoveryOrder.caseId, recoveryOrder.orderId)}>{t.returnRetry}</button>
          <button type="button" className={styles.textButton} disabled={waiting} onClick={() => void requestCancellation(activeCase.id)}>{t.cancel}</button>
        </div>
      </> : paymentReady && clientId ? <>
        <p>{t.plan[plan].scope}</p>
        <p>{materialsEnabled ? t.directPaymentIntro : t.directPaymentEmailIntro}</p>
        <p>{t.clock}</p>
        <p>{t.directScopeExclusions}</p>
        <form ref={form} className={styles.form} onSubmit={(event) => event.preventDefault()} onChange={(event) => setReady(event.currentTarget.checkValidity())}>
          <label>{t.email}<input type="email" name="email" autoComplete="email" maxLength={254} required readOnly={waiting} /><small>{t.directEmailHelp}</small></label>
          <fieldset className={styles.paymentTerms} disabled={waiting}>
            <legend>{terms.title}</legend>
            <p className={styles.paymentOutcome}><strong>{t.outcomeTitle}</strong></p>
            <p>{t.basedOnProvidedFacts}</p>
            <p>{t.minorNotice}</p>
            <p>{terms.attention}</p>
            <a className={styles.textButton} href="#review-agreement" onClick={openTerms}>{t.scopeTitle}</a>{' · '}
            <a className={styles.textButton} href="#review-refunds" onClick={openTerms}>{t.refundTitle}</a>{' · '}
            <a className={styles.textButton} href="#privacy" onClick={openTerms}>{t.privacyTitle}</a>
            {fields.map(([name, label]) => <label key={name} className={styles.check}><input type="checkbox" name={name} required /><span>{label}</span></label>)}
          </fieldset>
          {ready ? <PayPalButtons clientId={clientId} language={language} createOrder={createOrder} onApprove={onApprove}
            onCancel={cancelPayment} onError={paymentError} /> : <>
              <button type="button" className={styles.primary} aria-describedby="review-payment-requirements" disabled>{t.pay}</button>
              <p className={styles.quiet} id="review-payment-requirements">{t.directEnablePayment}</p>
            </>}
        </form>
      </> : <p className={styles.notice}>{t.closed}</p>}
      {paid && !canSend && paymentReady && <button type="button" className={styles.textButton} disabled={waiting}
        onClick={() => { setShowNew(true); setReady(false); setNotice(null); }}>{t.directStartAnother}</button>}
    </section>
  );
}

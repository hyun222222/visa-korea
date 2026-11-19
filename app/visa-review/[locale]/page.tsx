import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {isReviewMarket, reviewMarketAlternates, reviewMarketPath, reviewMarkets, reviewMarketsInOrder, reviewMarketUrl} from '@/lib/visa-review-locales';
import {reviewBusinessRegistrationNumber, reviewIntakeOpen, reviewOffice, reviewPlans} from '@/lib/visa-review-server';
import {khmerReview} from '../international-khmer';
import {internationalReview} from '../international-content';
import {copy, paypalEligibility, plans, type Plan} from '../review-copy';
import styles from '../review.module.css';
import {plansByScenario, saleScenarios} from '../sale-scenarios';
import saleStyles from './sale.module.css';

const landing = {
  ...internationalReview,
  km: khmerReview,
  en: {
    title: 'Korea Visa Denied? E-7, D-10, F-6 Written Review by a Korean Lawyer',
    description: 'Korea visa denied? A Korean lawyer reviews refusal reasons, re-entry, E-7 job changes, D-10 status and F-6 refusals. Get a written reply by email.',
    lead: copy.en.heroBody,
    choose: copy.en.planTitle,
    plans: plans.map(plan => copy.en.plan[plan]),
    timeTitle: 'Receive a written reply by email',
    time: copy.en.clock,
    scope: copy.en.directScopeExclusions,
    payment: paypalEligibility.en,
    checkout: 'Continue to checkout',
    policy: copy.en.refundTitle,
    checkoutLanguage: 'Checkout and terms are in English.',
    closed: copy.en.closed,
    materials: copy.en.process[1][1],
  },
  zh: {
    title: '韩国签证拒签、遣返后再入境 | 韩国律师书面审查',
    description: '韩国签证拒签、机场拒关或遣返后想再入境？韩国律师可审查拒签原因、E-7换工作及D-8汇款前的申请条件，并通过电子邮件提供书面答复。',
    lead: copy.zh.heroBody,
    choose: copy.zh.planTitle,
    plans: plans.map(plan => copy.zh.plan[plan]),
    timeTitle: '通过电子邮件收到书面意见',
    time: copy.zh.clock,
    scope: copy.zh.directScopeExclusions,
    payment: paypalEligibility.zh,
    checkout: '前往付款页面',
    policy: copy.zh.refundTitle,
    checkoutLanguage: '付款页面及服务条款提供简体中文。',
    closed: copy.zh.closed,
    materials: copy.zh.process[1][1],
  },
};

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  if (!isReviewMarket(locale)) notFound();
  const {title, description} = landing[locale];
  const canonical = reviewMarketUrl(locale);
  return {
    title: {absolute: title},
    description,
    alternates: {canonical, languages: reviewMarketAlternates},
    openGraph: {title, description, url: canonical, type: 'website', siteName: reviewOffice},
  };
}

export default async function ReviewMarketPage({params}: Props) {
  const {locale} = await params;
  if (!isReviewMarket(locale)) notFound();
  const text = landing[locale];
  const scenarios = saleScenarios[locale];
  const market = reviewMarkets[locale];
  const business = reviewBusinessRegistrationNumber();
  const open = await reviewIntakeOpen();
  const policyUrl = `/refund-policy?lang=${market.checkout}`;
  const checkoutUrl = (plan: Plan) => `/visa-review?lang=${market.checkout}&plan=${plan}#apply`;

  return (
    <div className={styles.site} lang={market.tag}>
      <header className={styles.masthead}>
        <div className={styles.container}>
          <a className={styles.firm} href="#plans">{reviewOffice}</a>
          <nav className={styles.language} aria-label="Languages">
            {reviewMarketsInOrder.map(code => (
              <a key={code} href={reviewMarketPath(code)} lang={reviewMarkets[code].tag} hrefLang={reviewMarkets[code].tag} aria-current={code === locale ? 'page' : undefined}>
                {reviewMarkets[code].label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <section className={`${styles.hero} ${styles.marketHero}`}>
        <div className={styles.container}>
          <div className={styles.heroCopy}>
            <h1>{text.title}</h1>
            <p className={styles.lead}>{text.lead}</p>
            <a className={styles.primary} href="#plans">{text.choose}</a>
          </div>
        </div>
      </section>
      <section className={`${styles.section} ${styles.container}`} id="plans">
        <div className={styles.sectionIntro}>
          <h2>{text.choose}</h2>
          <p>{text.payment}</p>
          {open ? <p>{text.checkoutLanguage}</p> : <p><strong>{text.closed}</strong></p>}
        </div>
        <section className={saleStyles.scenarios} aria-labelledby="review-scenarios">
          <h3 id="review-scenarios">{scenarios.heading}</h3>
          <ul>
            {plansByScenario.map((scenarioPlans, index) => (
              <li key={scenarios.situations[index]}>
                <p>{scenarios.situations[index]}</p>
                <div className={saleStyles.scenarioPlans}>
                  {scenarioPlans.map(plan => {
                    const title = text.plans[plans.indexOf(plan)].title;
                    const price = `US$${reviewPlans[plan].amountCents / 100}`;
                    return open ? (
                      <a className={styles.secondary} key={plan} href={checkoutUrl(plan)}>{title} · {price}</a>
                    ) : (
                      <span key={plan}>{title} · {price}</span>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </section>
        <div className={styles.plans}>
          {plans.map((plan, index) => {
            const offer = text.plans[index];
            return (
              <article className={styles.plan} key={plan} data-featured={plan === 'question'}>
                <h3>{offer.title}</h3>
                <p className={styles.price}><small>USD</small> {reviewPlans[plan].amountCents / 100}</p>
                <p>{offer.scope}</p>
                <p className={styles.planOutcome}>{offer.result}</p>
                {open && <a className={styles.secondary} href={checkoutUrl(plan)}>{text.checkout}</a>}
              </article>
            );
          })}
        </div>
      </section>
      <section className={styles.process}>
        <div className={styles.container}>
          <h2>{text.timeTitle}</h2>
          <p>{text.time}</p>
          <p>{text.materials}</p>
          <p>{text.scope}</p>
        </div>
      </section>
      <footer className={`${styles.container} ${styles.footer}`}>
        <strong>{reviewOffice}</strong>
        <span>{copy[market.checkout].representative}</span>
        {business && <span>{copy[market.checkout].businessNumber} {business}</span>}
        <address>502 East Wing, 16 Beobwon-ro, Seocho-gu, Seoul</address>
        <a href="mailto:info@kimnhyun.com">info@kimnhyun.com</a>
        <a href="tel:+82234777600">+82 2 3477 7600</a>
        <a href={policyUrl} hrefLang={market.checkout}>{text.policy}</a>
      </footer>
    </div>
  );
}

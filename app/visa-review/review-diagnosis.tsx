'use client';

import { useId, useState } from 'react';
import { copy, planPrice, plans, type Language, type Plan } from './review-copy';
import styles from './review.module.css';

type DiagnosisCopy = {
  heading: string;
  intro: string;
  question: string;
  options: Record<Plan, { title: string; examples: string }>;
  result: string;
  continue: string;
  complexScope: string;
  urgent: string;
  contact: string;
};

const diagnosisCopy: Record<Language, DiagnosisCopy> = {
  ko: {
    heading: '내게 맞는 비자 검토 찾기',
    intro: '개인정보를 입력하지 않고 필요한 검토 범위와 비용을 확인하세요.',
    question: '어떤 검토가 필요하신가요?',
    options: {
      question: {title: '한 가지 상황에 관해 묻고 싶어요', examples: '이직, 부업, 과거 초과 체류처럼 서류 없이 설명할 수 있는 질문'},
      documents: {title: '내 자료로 비자 요건을 확인하고 싶어요', examples: '채용계약서, 점수, 소득, 체류 이력과 비자 요건 대조'},
      strategy: {title: '통지서나 계약서에서 대응 방법을 찾고 싶어요', examples: '거절·출국 통지, 서명 전 계약서 또는 서로 얽힌 여러 쟁점'},
    },
    result: '이 상황에 맞는 서면검토',
    continue: '이 검토로 접수하기',
    complexScope: '쟁점이 여러 개면 사무소가 먼저 어떤 범위까지 검토할 수 있는지 확인합니다.',
    urgent: '신청·불복·출국 기한이 임박했다면 온라인 답변을 기다리기 전에 사무소에 문의해 주세요.',
    contact: '사무소에 이메일 문의',
  },
  en: {
    heading: 'Find the right visa review',
    intro: 'Check what a lawyer can review and what it costs without entering personal details.',
    question: 'What do you need help reviewing?',
    options: {
      question: {title: 'I have one specific question', examples: 'A job change, side work or past overstay you can explain without documents'},
      documents: {title: 'I want to check visa requirements against my evidence', examples: 'A job offer, points, income or residence history for one visa route'},
      strategy: {title: 'I need advice on a notice, contract or related risks', examples: 'A refusal or departure notice, a contract before signing, or several linked issues'},
    },
    result: 'Written review for your situation',
    continue: 'Request this review',
    complexScope: 'If your case involves several issues, the office will first confirm what this review can cover.',
    urgent: 'If a filing, appeal or departure deadline is close, contact the office before waiting for an online reply.',
    contact: 'Email the office',
  },
  zh: {
    heading: '找到适合您的签证审查服务',
    intro: '无需填写个人信息，即可查看适合您的审查范围和费用。',
    question: '您需要审查什么？',
    options: {
      question: {title: '我有一个具体的问题', examples: '无需提交材料即可说明的换工作、兼职或过去逾期停留问题'},
      documents: {title: '我想用现有材料核对签证条件', examples: '核对一类签证的聘用合同、积分、收入或居留记录'},
      strategy: {title: '我需要了解如何处理通知书、合同或相关风险', examples: '拒签或离境通知、待签署的合同，或多个相互关联的问题'},
    },
    result: '适合您情况的书面审查',
    continue: '申请此项审查',
    complexScope: '如涉及多个问题，事务所会先确认本次审查可以涵盖的范围。',
    urgent: '如申请、申诉或离境期限临近，请尽快联系事务所。',
    contact: '发送邮件咨询事务所',
  },
};

export default function ReviewDiagnosis({ language, onRecommend }: {
  language: Language;
  onRecommend: (plan: Plan) => void;
}) {
  const [selection, setSelection] = useState<Plan | null>(null);
  const name = useId();
  const t = diagnosisCopy[language];
  const plan = selection ? copy[language].plan[selection] : null;

  return (
    <section id="diagnosis" className={styles.diagnosis} aria-labelledby="review-diagnosis-heading">
      <div className={styles.container}>
        <div className={styles.sectionIntro}>
          <h2 id="review-diagnosis-heading">{t.heading}</h2>
          <p>{t.intro}</p>
        </div>
        <fieldset className={styles.diagnosisOptions}>
          <legend>{t.question}</legend>
          {plans.map((option) => (
            <label className={styles.diagnosisOption} data-selected={selection === option} key={option}>
              <input type="radio" name={name} value={option} checked={selection === option} onChange={() => setSelection(option)} />
              <span>
                <strong>{t.options[option].title}</strong>
                <small>{t.options[option].examples}</small>
              </span>
            </label>
          ))}
        </fieldset>
        <div className={styles.diagnosisResponse} data-selected={!!selection}>
          <div aria-live="polite" aria-atomic="true">
            {selection && plan && (
              <>
                <h3>{t.result}</h3>
                <p className={styles.diagnosisTitle}>{plan.title} <strong>${planPrice[selection]} USD</strong></p>
                <p>{plan.scope}</p>
                <p>{plan.result}</p>
                {selection === 'strategy' && <p>{t.complexScope}</p>}
              </>
            )}
          </div>
          {selection && <a className={styles.primary} href="#apply" onClick={() => onRecommend(selection)}>{t.continue}</a>}
          {selection === 'strategy' && (
            <p className={styles.diagnosisUrgent}>{t.urgent} <a href="mailto:info@kimnhyun.com">{t.contact}</a></p>
          )}
        </div>
      </div>
    </section>
  );
}

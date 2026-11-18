import { copy, planPrice, type Language, type Plan } from './review-copy';
import styles from './review.module.css';
import situationStyles from './review-situations.module.css';

type Situation = {
  title: string;
  prompt: string;
  result: string;
};

type SituationKey = 'job-loss' | 'job-transfer' | 'refusal' | 'residence' | 'investment';

export const situationPlans: Record<SituationKey, Plan> = {
  'job-loss': 'question',
  'job-transfer': 'documents',
  refusal: 'strategy',
  residence: 'documents',
  investment: 'documents',
};

export const reviewSituations: Record<Language, Record<SituationKey, Situation>> = {
  ko: {
    'job-loss': {
      title: 'E-7-4로 일하다 해고됐는데 D-10으로 바꿀 수 있나요?',
      prompt: '고용이 끝난 이유와 날짜, 현재 체류 만료일을 알려 주세요.',
      result: '변호사가 D-10 전환을 검토할 수 있는지와 다음에 확인할 사항 한 가지를 서면으로 답합니다.',
    },
    'job-transfer': {
      title: 'E-7 새 직장을 구했는데 이적동의서가 필요한가요?',
      prompt: '이전 계약이 어떻게 끝났는지와 새 회사에서 맡을 일을 알려 주세요.',
      result: '새 계약서와 관련 증빙을 보고, 검토할 근무처 변경 절차와 더 필요한 자료를 정리합니다.',
    },
    refusal: {
      title: '비자 거절통지서를 받았는데 무엇부터 확인하나요?',
      prompt: '통지서에 적힌 거절 사유가 무엇을 뜻하는지, 다시 신청하려면 무엇을 보완해야 하는지 확인합니다.',
      result: '통지서 한 건을 읽고, 확인 가능한 기한과 재신청 등 대응 선택지별 위험을 서면으로 정리합니다.',
    },
    residence: {
      title: 'F-2-7 점수나 F-5 영주 요건을 자료로 입증할 수 있나요?',
      prompt: 'F-2-7과 F-5 중 하나를 선택하세요. 소득·체류 이력 등 해당 요건에 맞는 자료를 검토합니다.',
      result: '요건별로 충족, 미충족, 확인 필요를 표시하고 부족한 증빙을 알려드립니다.',
    },
    investment: {
      title: 'D-8을 준비 중인데 송금 전에 무엇을 확인하나요?',
      prompt: '예정된 투자금의 출처, 투자 방식, 준비한 자료를 알려 주세요.',
      result: '예정된 투자 방식에 적용할 D-8 요건과 송금 전에 챙길 증빙을 정리합니다.',
    },
  },
  en: {
    'job-loss': {
      title: 'Can I switch from E-7-4 to D-10 after losing my job?',
      prompt: 'Tell us why and when your employment ended and when your current permission to stay expires.',
      result: 'A lawyer explains whether a D-10 change is worth pursuing in your situation and identifies one next step.',
    },
    'job-transfer': {
      title: 'I have a new E-7 job offer. Do I need a release letter?',
      prompt: 'Tell us how your previous contract ended and what you will do for the new employer.',
      result: 'We review your new contract and supporting evidence, then identify the workplace-change procedure to check and any missing documents.',
    },
    refusal: {
      title: 'I received a visa refusal notice. What should I check first?',
      prompt: 'Find out what the reason on your notice means and what you may need to address before reapplying.',
      result: 'A lawyer reviews one notice and explains the verifiable deadlines and risks of your options in writing.',
    },
    residence: {
      title: 'Can my evidence support F-2-7 points or F-5 permanent residence?',
      prompt: 'Choose one route. We check the evidence that matters for it, such as income and residence history.',
      result: 'Get a table showing which requirements the evidence meets, what falls short and what still needs verification.',
    },
    investment: {
      title: 'What should I check before transferring funds for D-8?',
      prompt: 'Describe the source of funds, your proposed investment and the documents you already have.',
      result: 'Get the D-8 requirements to check for your proposed investment and an evidence list to prepare before remittance.',
    },
  },
  zh: {
    'job-loss': {
      title: '持 E-7-4 被解雇后，可以转为 D-10 吗？',
      prompt: '请说明离职原因、劳动关系结束日期及目前的停留期限。',
      result: '律师会书面说明您的情况是否可以考虑申请转为 D-10，并指出下一步需要确认的一件事。',
    },
    'job-transfer': {
      title: '持 E-7 找到了新工作，还需要原单位的同意书吗？',
      prompt: '请说明原合同如何结束，以及您在新公司将承担什么工作。',
      result: '律师会审阅新合同及相关证明，列出要确认的工作单位变更手续及缺少的材料。',
    },
    refusal: {
      title: '收到韩国签证拒签通知后，先确认什么？',
      prompt: '了解通知书所载拒签理由的含义，以及重新申请前需要补充哪些材料。',
      result: '律师会审阅一份通知书，书面说明可核实的期限及各应对方案的风险。',
    },
    residence: {
      title: '现有材料能证明 F-2-7 积分或 F-5 永居申请条件吗？',
      prompt: '请选择一个类别。律师会核对与该类别相关的收入、居留记录等证明。',
      result: '您将收到逐项对照表，了解哪些条件已满足、哪些未满足，以及哪些还需核实。',
    },
    investment: {
      title: '准备申请 D-8，汇款前应确认什么？',
      prompt: '请说明投资资金来源、拟采用的投资方式及已有材料。',
      result: '律师会列出拟采用的投资方式所涉及的 D-8 条件，以及汇款前需要准备的证明。',
    },
  },
};

const sectionCopy = {
  ko: { title: '비자 문제별로 받을 수 있는 답', action: '자가진단 시작' },
  en: { title: 'What a lawyer can check in your visa situation', action: 'Start self-assessment' },
  zh: { title: '律师可以为您核对哪些签证问题', action: '开始自测' },
};

export default function ReviewSituations({
  language,
  onChoose,
}: {
  language: Language;
  onChoose: (plan: Plan) => void;
}) {
  const labels = sectionCopy[language];
  const situations = reviewSituations[language];

  return (
    <section className={styles.section} aria-labelledby="review-situations-title">
      <div className={styles.container}>
        <header className={styles.sectionIntro}>
          <h2 id="review-situations-title">{labels.title}</h2>
        </header>
        <div className={situationStyles.situations}>
          {Object.entries(situations).map(([key, situation]) => {
            const plan = situationPlans[key as SituationKey];
            const planLabel = `${copy[language].plan[plan].title} · US$${planPrice[plan]}`;
            return (
              <article key={key} className={situationStyles.situation}>
                <div>
                  <h3>{situation.title}</h3>
                  <p>{situation.prompt}</p>
                  <p>{situation.result}</p>
                </div>
                <div className={situationStyles.action}>
                  <p>{planLabel}</p>
                  <a href="#diagnosis" className={styles.secondary}
                    aria-label={`${labels.action} · ${situation.title} · ${planLabel}`}
                    onClick={() => onChoose(plan)}>
                    {labels.action}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

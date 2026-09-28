'use client';

import {useEffect, useId, useRef, useState, type FormEvent} from 'react';
import {airportContact} from '@/lib/airport-contact';

type Language = 'ko' | 'en';
type Answer = 'yes' | 'no' | 'unknown';
type Question = {
  id: string;
  group: 'situation' | 'documents';
  title: Record<Language, string>;
  hint: Record<Language, string>;
  prepare: Record<Language, string>;
  summary: Record<Language, string>;
};

const questions: Question[] = [
  {
    id: 'at-airport', group: 'situation',
    title: {ko: '당사자가 지금 한국 공항에서 추가 심사 또는 입국불허로 대기 중인가요?', en: 'Is the traveler still at a Korean airport for further inspection or entry refusal?'},
    hint: {ko: '가족·초청인이 대신 점검해도 됩니다. 출발 전 온라인 비자·K-ETA 거절은 다른 절차입니다.', en: 'A family member or host may answer. An online visa or K-ETA refusal before travel is a different process.'},
    prepare: {ko: '현재 공항에 있는지 먼저 확인하세요. 이미 송환됐거나 아직 출발 전이라면 현재 단계에 맞는 검토 범위를 문의하세요.', en: 'Confirm the traveler’s current location. If already returned or not yet traveling, ask which review fits the current stage.'},
    summary: {ko: '한국 공항에서 심사·입국불허 대기 중', en: 'Still at Korean airport for inspection/refusal'},
  },
  {
    id: 'return-time', group: 'situation',
    title: {ko: '지정된 송환 항공편과 출발 예정 시각을 알고 있나요?', en: 'Do you know the assigned return flight and its departure time?'},
    hint: {ko: '원래 예약한 귀국편과 구별하세요. 아직 정해지지 않았다면 모름을 선택하세요.', en: 'Distinguish this from the traveler’s original return booking. Choose Not sure if no flight has been assigned.'},
    prepare: {ko: '항공사나 담당자에게 지정 항공편·출발 시각·현재 대기 장소를 확인하세요. 남은 시간에 따라 가능한 초기 대응이 달라집니다.', en: 'Ask the airline or officer for the assigned flight, departure time and waiting location. Time remaining affects the initial steps available.'},
    summary: {ko: '지정 송환편·출발 시각 확인', en: 'Assigned return flight/time known'},
  },
  {
    id: 'notice', group: 'documents',
    title: {ko: '입국불허 통지서나 현재 받은 안내를 가지고 있나요?', en: 'Do you have the refusal notice or the instructions received so far?'},
    hint: {ko: '통지서 앞·뒷면 전체와 받은 시각, 안내된 사유를 확인하세요. 서면이 없으면 당시 들은 내용을 메모하세요.', en: 'Keep every page, the time received and the stated reasons. If nothing was given in writing, note what you were told.'},
    prepare: {ko: '받은 통지서·추가 심사 안내·이의 제기 안내를 확보하고 통지 시각을 적으세요. 없으면 누가 언제 무엇을 말했는지 남기세요. 결정 내용과 절차를 구별하는 자료입니다.', en: 'Keep any notice, further-inspection or objection instructions and record when received. If none, note who said what and when. This helps identify the decision and stage.'},
    summary: {ko: '불허 통지·현재 안내 기록', en: 'Refusal notice/current instructions'},
  },
  {
    id: 'purpose', group: 'documents',
    title: {ko: '이번 방문 목적을 보여 주는 기존 자료가 있나요?', en: 'Do you have existing records supporting the actual purpose of this visit?'},
    hint: {ko: '입국 전 예약 이력이 확인되는 일정·초청 이메일·회의 약속·진료 예약 등, 실제 목적에 맞는 자료를 고르세요.', en: 'Examples: a pre-arrival booking history, invitation email, meeting arrangement or appointment matching the real purpose.'},
    prepare: {ko: '예약일·방문일·상대방을 확인할 수 있는 기존 예약 확인서, 초청 이메일 또는 일정 약속을 찾으세요. 심사 때 설명한 목적과 맞는지 확인하는 데 쓰입니다.', en: 'Find existing booking confirmations, invitation emails or arrangements showing booking date, visit date and the other party. They help compare the actual purpose with the interview account.'},
    summary: {ko: '실제 방문 목적의 기존 증빙', en: 'Existing proof of actual visit purpose'},
  },
  {
    id: 'stay', group: 'documents',
    title: {ko: '실제 숙소와 연락 가능한 숙소·초청인 정보를 확인할 수 있나요?', en: 'Can you confirm the actual accommodation and a reachable hotel or host?'},
    hint: {ko: '숙소 주소·투숙자·기간이 나온 예약 확인서, 또는 실제 머물 집과 초청인의 연락 방법을 확인하세요.', en: 'Check the booking’s address, guest names and dates, or the actual host’s address and contact details.'},
    prepare: {ko: '예약 확인서의 주소·투숙자·날짜를 입국신고 내용과 대조하세요. 지인 집이라면 실제 초청 경위와 연락 방법을 확인하세요. 변경이 있었다면 기존 기록과 변경 이유를 함께 남기세요.', en: 'Compare the booking’s address, guests and dates with the arrival declaration. For a host’s home, confirm the actual invitation and contact details. Keep original records and explain any changes.'},
    summary: {ko: '숙소·연락 가능한 숙소 또는 초청인', en: 'Accommodation and reachable hotel/host'},
  },
  {
    id: 'funds', group: 'documents',
    title: {ko: '경비를 실제로 부담하는 사람과 자금 자료를 확인할 수 있나요?', en: 'Can you identify who actually pays and records supporting the travel funds?'},
    hint: {ko: '본인 잔액·관련 급여나 송금 기록, 초청인이 부담한다면 그 범위와 근거입니다. 모든 사람에게 같은 최소 잔액이 필요한 것은 아닙니다.', en: 'Examples: available funds, relevant salary or transfer records, or what the host actually covers. There is no universal minimum balance in this checklist.'},
    prepare: {ko: '실제 경비 부담자와 숙박·항공료·체재비의 부담 범위를 정리하고 잔액 또는 관련 송금 자료를 찾으세요. 계좌번호는 가리고 비밀번호·인증번호는 보내지 마세요.', en: 'Identify the actual payer and which costs they cover; find relevant balance or transfer records. Mask account numbers and never send passwords or verification codes.'},
    summary: {ko: '실제 경비 부담·자금 자료', en: 'Actual payer/funds records'},
  },
  {
    id: 'original-departure', group: 'documents',
    title: {ko: '원래 출국 계획을 보여 주는 항공권 등 자료가 있나요?', en: 'Do you have records of the originally planned departure from Korea?'},
    hint: {ko: '기존 귀국·제3국행 항공권과, 해당하는 경우 실제 거주국 체류 자격·복직·복학 일정입니다.', en: 'Examples: the original return/onward ticket and, if relevant, residence status or a return-to-work or study date.'},
    prepare: {ko: '입국 전의 귀국·제3국행 예약과 변경 이력을 보존하세요. 해당하면 실제 거주국으로 돌아갈 자격·직장 복귀·학사 일정도 정리하세요. 새로 지정된 송환편과 구별해 계획의 경위를 설명합니다.', en: 'Keep the original return/onward booking and changes. If relevant, identify permission to return to the country of residence and work/study dates. Distinguish the original plan from the assigned return flight.'},
    summary: {ko: '원래 출국·귀국 계획 자료', en: 'Original departure/return-plan records'},
  },
  {
    id: 'interview', group: 'documents',
    title: {ko: '심사 질문과 실제 답변, 통역 내용을 정리해 두었나요?', en: 'Have you noted the inspection questions, actual answers and interpretation?'},
    hint: {ko: '방문 목적·동행인·숙소·경비·기간에 대한 문답을 기억나는 범위에서 적으세요. 모르는 부분은 모른다고 표시하세요.', en: 'Note what you recall about purpose, companions, accommodation, costs and duration. Mark anything you cannot remember.'},
    prepare: {ko: '질문 → 실제 답변 → 통역 내용 → 바로잡을 부분 → 뒷받침할 기록 순서로 메모하세요. 이전 진술과 달라지는 부분은 이유를 적고, 불리한 답변도 빼지 마세요.', en: 'Write the question, actual answer, interpretation, any correction and supporting record. Explain differences from earlier answers and retain unfavorable facts too.'},
    summary: {ko: '심사 문답·통역 메모', en: 'Inspection/interpretation notes'},
  },
];

const answerLabels: Record<Language, Record<Answer, string>> = {
  ko: {yes: 'O · 예', no: 'X · 아니요', unknown: '? · 모름'},
  en: {yes: 'O · Yes', no: 'X · No', unknown: '? · Not sure'},
};

export function AirportSelfCheck({lang}: {lang: Language}) {
  const ko = lang === 'ko';
  const prefix = useId();
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const answered = questions.filter(question => answers[question.id]).length;

  useEffect(() => {
    if (submitted) resultRef.current?.focus();
  }, [submitted]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const unanswered = questions.find(question => !answers[question.id]);
    if (unanswered) {
      setError(true);
      formRef.current?.querySelector<HTMLInputElement>(`input[data-question="${unanswered.id}"]`)?.focus();
      return;
    }
    setError(false);
    setSubmitted(true);
  }

  function edit(reset = false) {
    if (reset) setAnswers({});
    setError(false);
    setSubmitted(false);
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>('input')?.focus());
  }

  const missingDocuments = questions.filter(question => question.group === 'documents' && answers[question.id] !== 'yes');
  const summary = [
    ko ? '한국 공항 입국불허 — 자가 점검 요약' : 'Korean airport entry refusal — self-check summary',
    ...questions.map(question => `${question.summary[lang]}: ${answers[question.id] ? answerLabels[lang][answers[question.id]] : '—'}`),
    '',
    ko ? '현재 가능한 검토와 업무 범위를 문의합니다.' : 'Please advise on current availability and the scope of assistance.',
    ko ? '공항·터미널 / 지정 송환 시각(KST): [직접 추가]' : 'Airport/terminal / assigned return time (KST): [add here]',
  ].join('\n');
  const whatsappHref = `${airportContact.whatsapp}?text=${encodeURIComponent(summary)}`;
  const emailHref = `${airportContact.email}?subject=${encodeURIComponent(ko ? '공항 입국불허 — 자가 점검 후 문의' : 'Airport entry refusal — self-check inquiry')}&body=${encodeURIComponent(summary)}`;

  return <section className="kh-section airport-check" id="self-check" aria-labelledby={`${prefix}-title`}>
    <span className="kh-eyebrow">{ko ? '지금 상황과 준비자료 확인' : 'YOUR SITUATION & RECORDS'}</span>
    <h2 id={`${prefix}-title`}>{ko ? '공항 입국불허, 지금 무엇을 가지고 있나요?' : 'At the airport: what records do you have?'}</h2>
    <p className="airport-check-intro">{ko ? '8가지에 O·X·모름으로 답하면 먼저 확인할 자료를 정리해 드립니다. 가족·초청인도 할 수 있습니다. 모든 서류를 모을 때까지 연락을 미룰 필요는 없습니다.' : 'Answer 8 questions with Yes, No or Not sure to identify records to check first. Family members and hosts can use this too. You do not need every document before contacting us.'}</p>
    <p className="airport-check-share-note">{ko ? '이 점검은 입국 가능성 판정이나 변호사의 법률 검토가 아닙니다. 답변은 이 화면에서만 계산되며 사이트로 전송·저장되지 않습니다.' : 'This is a preparation check, not a prediction of admission or a legal review by an attorney. Answers stay in this page and are not submitted to or saved by this website.'}</p>

    {!submitted ? <form ref={formRef} onSubmit={submit} noValidate>
      {(['situation', 'documents'] as const).map(group => <div className="airport-check-group" key={group}>
        <h3>{group === 'situation' ? (ko ? '1. 현재 상황' : '1. Current situation') : (ko ? '2. 이미 있는 기록·서류' : '2. Records you already have')}</h3>
        {questions.filter(question => question.group === group).map(question => <fieldset className="airport-check-question" key={question.id} aria-describedby={`${prefix}-${question.id}-hint`}>
          <legend>{question.title[lang]}</legend>
          <p className="airport-check-hint" id={`${prefix}-${question.id}-hint`}>{question.hint[lang]}</p>
          <div className="airport-check-options">
            {(['yes', 'no', 'unknown'] as const).map(answer => <label className="airport-check-option" key={answer} data-selected={answers[question.id] === answer ? 'true' : 'false'}>
              <input type="radio" name={`${prefix}-${question.id}`} data-question={question.id} value={answer} checked={answers[question.id] === answer} onChange={() => {setAnswers(current => ({...current, [question.id]: answer})); setError(false);}}/>
              <span>{answerLabels[lang][answer]}</span>
            </label>)}
          </div>
        </fieldset>)}
      </div>)}
      <p className="airport-check-progress" aria-live="polite">{ko ? `${questions.length}개 중 ${answered}개 응답` : `${answered} of ${questions.length} questions answered`}</p>
      {error && <p className="airport-check-error" role="alert">{ko ? '각 문항에 답해 주세요. 확인하기 어려우면 모름을 선택하면 됩니다.' : 'Please answer each question. Choose Not sure when you cannot confirm it.'}</p>}
      <div className="airport-check-actions"><button className="kh-button" type="submit">{ko ? '확인할 자료와 연락 방법 보기' : 'See records to check & contact options'}</button><a href="#consultation">{ko ? '업무 범위·비용 먼저 보기' : 'View scope & fees first'}</a></div>
    </form> : <div className="airport-check-result" ref={resultRef} tabIndex={-1} aria-labelledby={`${prefix}-result-title`}>
      <h3 id={`${prefix}-result-title`}>{ko ? '먼저 확인할 자료와 다음 단계' : 'Records to check and your next step'}</h3>
      <p className="airport-check-result-note">{ko ? '서류 보유 여부를 정리한 결과입니다. O가 많아도 입국 허가나 송환 중단을 의미하지 않으며, X가 있어도 검토를 요청할 수 있습니다.' : 'This summarizes document readiness only. Yes answers do not mean admission or suspension of return. You can request a review even when records are missing.'}</p>
      {answers['at-airport'] !== 'yes' && <p className="kh-note">{questions[0].prepare[lang]} {ko ? '이 긴급 패키지는 한국 공항의 입국불허 사건을 대상으로 합니다.' : 'This emergency package concerns entry-refusal matters at Korean airports.'}</p>}
      {answers['return-time'] !== 'yes' && <p className="kh-note">{questions[1].prepare[lang]}</p>}
      <div className="airport-check-contacts">
        <h3>{ko ? '김앤현 법률사무소에 바로 연락' : 'Contact Kim & Hyun Law Office'}</h3>
        <p>{ko ? '공항·터미널과 지정된 송환 시각을 알려 주세요. 현재 대응 가능한 업무를 확인합니다.' : 'Tell us the airport, terminal and assigned return time so we can check what assistance is currently available.'}</p>
        <p className="airport-check-share-note">{ko ? 'WhatsApp·이메일을 누르면 아래 요약이 외부 앱으로 넘어갑니다. WhatsApp에는 보내기 전에도 초안이 전달됩니다. 확인·수정한 뒤 직접 보내세요. 이름·여권번호·서류는 포함하지 않으며, 전화에는 요약이 전송되지 않습니다.' : 'WhatsApp and Email pass the summary to an external app. Opening WhatsApp shares the draft with its provider before you press Send. Review and send it yourself. No name, passport number or files are included. Calling sends no summary.'}</p>
        <details className="airport-check-summary"><summary>{ko ? '연락 앱에 전달할 요약 보기' : 'Preview the summary for your contact app'}</summary><pre>{summary}</pre></details>
        <nav className="airport-check-actions" aria-label={ko ? '점검 후 사무소 연락' : 'Contact the office after your check'}>
          <a className="kh-button" href={whatsappHref} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">WhatsApp</a>
          <a className="kh-button" href={airportContact.phone}>{ko ? '전화' : 'Call'}</a>
          <a className="kh-button" href={emailHref}>{ko ? '이메일' : 'Email'}</a>
        </nav>
        <p className="airport-check-share-note">{ko ? '문의만으로 사건 수임이나 송환 중단이 확정되지는 않습니다. 회신 및 수임 가능 여부는 사무소 상황에 따라 달라집니다. 실제 사건 서류는 계약·결제 후 info@kimnhyun.com으로 보내 주세요.' : 'An inquiry does not confirm case acceptance or suspend return. Replies and acceptance depend on office availability. After signing and paying, email actual case documents to info@kimnhyun.com.'}</p>
      </div>

      <div className="airport-check-service"><h3>{ko ? '어떤 도움을 받고, 얼마를 결제하나요?' : 'What help is included, and what does it cost?'}</h3><p>{ko ? '긴급 검토·서면 작성·초기 대응의 구체적 범위와 비용을 확인하세요. 접수가 열려 있으면 사전 연락 없이도 계약 확인·전자서명·PayPal 결제를 진행할 수 있습니다.' : 'Review the scope and fee for urgent review, document preparation and initial response. When intake is open, you may review and sign the agreement and pay with PayPal without contacting us first.'}</p><div className="airport-check-actions"><a className="kh-button" href="#consultation">{ko ? '업무 범위·비용 보기' : 'View scope & fees'}</a><a href={`/${lang}/entry-refusal/apply`}>{ko ? '온라인 의뢰·계약·결제' : 'Apply online · Agreement & payment'}</a><a href="#documents">{ko ? '상세 준비자료 안내' : 'Detailed document guide'}</a></div></div>
      {missingDocuments.length ? <details className="airport-check-missing-details"><summary>{ko ? `확인할 자료 ${missingDocuments.length}개 — 이유와 준비 예시` : `${missingDocuments.length} records to check — why and what to prepare`}</summary><ul className="airport-check-missing">{missingDocuments.map(question => <li key={question.id}><strong>{question.summary[lang]}</strong><p>{question.prepare[lang]}</p></li>)}</ul></details> : <p>{ko ? '선택한 자료가 모두 있다고 답하셨습니다. 날짜·명의·실제 방문 목적이 서로 맞는지, 심사 당시 설명과 다른 부분이 있는지 원본을 대조해 주세요. 자료의 내용과 충분성은 별도 검토가 필요합니다.' : 'You indicated that all listed records are available. Compare dates, names and the actual visit purpose against each other and the interview account. Their content and sufficiency still need individual review.'}</p>}
      <p>{ko ? '자료를 새로 꾸미거나 소급 작성하지 마세요. 지금 가진 기록으로 연락하고, 필요한 추가 자료는 검토 후 안내받으세요.' : 'Do not fabricate or backdate records. Contact us with what you have; any further records needed can be identified during review.'}</p>
      <div className="airport-check-reset"><button type="button" onClick={() => edit()}>{ko ? '답변 수정' : 'Edit answers'}</button><button type="button" onClick={() => edit(true)}>{ko ? '다시 점검' : 'Start again'}</button></div>
    </div>}
  </section>;
}

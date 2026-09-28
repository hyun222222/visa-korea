type DocumentLanguage = 'ko' | 'en';
type BilingualText = Record<DocumentLanguage, string>;
type DocumentGroup = {
  id: string;
  title: BilingualText;
  purpose: BilingualText;
  items: BilingualText[];
  note: BilingualText;
};

const priorityDocuments: BilingualText[] = [
  {
    ko: '입국불허 통지서 전체: 앞·뒷면과 표시된 불허 사유를 준비하세요. 서명 여부와 관계없이 통지받은 시각, 서명한 시각, 이의신청한 시각을 구분해 적으세요. 받은 이의신청 안내·신청서·결과 통지도 보관하세요. 통지서가 없다면 담당자가 한 말과 들은 시각을 그대로 메모하세요.',
    en: 'The complete refusal notice: include both sides and the marked reason. Whether or not you signed, record notification, signing and any objection submission times separately. Keep objection instructions, applications and decisions received. If there is no notice, write down the words you were told and when.',
  },
  {
    ko: '항공편 세 가지를 구분하세요: 한국에 온 항공편, 원래 예약한 출국 항공편, 입국불허 후 새로 지정된 송환 항공편입니다. 항공사·편명·공항·터미널·출발 날짜와 시각, 시간대를 적고 예약확인서와 발권된 전자항공권을 함께 준비하세요. 한국 공항 출발 시각은 한국시간(KST)으로 표시하세요.',
    en: 'Separate three flight records: your flight into Korea, your originally planned departure and any newly assigned return flight after refusal. Give the airline, flight number, airport, terminal, date, time and time zone. Keep both booking confirmations and issued e-tickets. Mark departures from Korea in Korean time (KST).',
  },
  {
    ko: '여권 인적사항 면과 보유한 사증·입국 관련 허가: 처음에는 필요한 면만 준비하고 여권번호, 기계판독영역(MRZ), 바코드·QR코드와 다른 고유식별번호는 가리세요. 보유하고 있다면 이미 제출한 입국신고서와 사증 신청 때 적은 방문 목적·숙소 자료도 함께 확인하세요. 여권 전체 사본은 필요하지 않으며, 추가 확인 범위는 사무소가 안내합니다.',
    en: 'Your passport identity page and existing visa or entry authorization: initially prepare relevant pages, masking passport numbers, the machine-readable zone (MRZ), barcodes, QR codes and other unique IDs. If available, also check your submitted arrival declaration and the purpose and accommodation stated in your visa application. Do not send the entire passport; the office will explain any further identification needed.',
  },
  {
    ko: '사실관계 메모 1장: 도착부터 현재까지의 시간순 경과, 실제 방문 목적·숙소·만날 사람, 비용 부담자, 원래 출국 계획, 심사 질문과 실제 답변, 통역 언어와 이해하지 못한 부분을 적으세요. 모르는 사항은 추측하지 말고 “모름”으로 표시하세요.',
    en: 'One factual memo: record the timeline from arrival, your actual purpose, accommodation, people you will meet, who pays, planned departure, inspection questions and your actual answers. Note the interpreter’s language and anything you did not understand. Mark unknown facts as “unknown”.',
  },
  {
    ko: '문제가 된 사유를 가장 잘 설명하는 기존 자료: 아래 항목 중 본인에게 해당하는 자료를 고르세요. 예를 들어 관광 목적이 의심되면 실제 예약·일정, 초청 관계가 의심되면 관계·초청 자료, 비용 부담이 문제라면 실제 지급자와 자금 자료를 우선합니다.',
    en: 'The strongest existing record addressing the disputed reason: choose the relevant categories below. For example, use actual bookings and plans for a questioned tourism purpose, relationship and invitation records for a questioned host, or evidence of the real payer and available funds for funding concerns.',
  },
];

const documentGroups: DocumentGroup[] = [
  {
    id: 'tourism',
    title: {ko: '관광 목적·숙소·여행 일정이 의심되는 경우', en: 'Tourism, accommodation or itinerary questioned'},
    purpose: {ko: '실제로 어디에서 머물고 무엇을 하려 했는지, 심사 답변과 기존 예약이 일치하는지 확인합니다.', en: 'These records help check where you actually planned to stay, what you planned to do and whether existing bookings match your answers.'},
    items: [
      {ko: '입국 전 예약한 사실이 확인되는 호텔·숙소 자료: 최초 예약일, 투숙객 이름, 정확한 주소, 체크인·체크아웃 날짜, 현재 예약 상태와 결제 영수증이 보이게 준비하세요. 확인서를 나중에 재발급받았다면 최초 예약일과 재발급일을 구분하세요.', en: 'Records of accommodation booked before arrival: show the original booking date, guest name, actual address, check-in and check-out dates, current booking status and any payment receipt. If a confirmation was reissued later, distinguish the original booking date from its reissue date.'},
      {ko: '날짜별 실제 일정: 도시·이동수단·방문 장소를 간단히 적고 이미 예약한 공연·관광·교통편 자료와 연결하세요. 확정 예약과 아직 계획 중인 활동을 구분하세요.', en: 'A realistic daily itinerary: list cities, transport and places to visit, linked to existing activity, event or transport bookings. Distinguish confirmed bookings from plans.'},
      {ko: '예약을 바꿨다면 최초 예약, 변경·취소 확인서, 변경 시각과 실제 이유를 함께 준비하세요. 여행 동행자가 따로 도착했다면 각자의 항공편과 합류 계획을 설명하세요.', en: 'If plans changed, keep the original booking, change or cancellation confirmation, the date of the change and the real reason. If companions arrived separately, explain their flights and meeting plans.'},
    ],
    note: {ko: '예약 수가 많다고 유리한 것은 아닙니다. 실제 이용할 계획이 없는 예약을 새로 만들거나 과거부터 있었던 것처럼 꾸미지 마세요.', en: 'More bookings do not automatically make the case stronger. Do not create bookings you do not intend to use or present new records as if they existed earlier.'},
  },
  {
    id: 'host',
    title: {ko: '가족·친구·연인 방문 또는 국내 초청 관계', en: 'Visiting family, a friend, a partner or a host'},
    purpose: {ko: '누구를 왜 방문하며, 어디에 머물고 누가 비용을 부담하는지 확인합니다.', en: 'These records help establish whom you are visiting, why, where you will stay and who will pay.'},
    items: [
      {ko: '실제 초청인이 작성한 확인서: 작성일·작성자 성명·서명, 여행자와의 관계 및 알게 된 경위, 방문 기간·목적, 숙소 주소와 실제 제공 여부, 비용 부담 범위, 지금 연락받을 전화번호와 가능한 시간을 적으세요. 과거부터 있었던 방문 계획과 지금 새로 제안하는 지원을 구분하세요.', en: 'A dated confirmation signed by the actual host: give the host’s name, relationship and how you met, visit dates and purpose, accommodation address and actual arrangements, costs covered, and a telephone number and time to reach the host now. Distinguish prior visit plans from support newly offered now.'},
      {ko: '관계가 쟁점인 경우에만 관련 가족관계·혼인·출생 자료 또는 관계를 보여주는 필요한 날짜의 연락·만남 기록을 준비하세요. 가족 전체의 개인정보나 대화 전체를 보낼 필요는 없습니다.', en: 'If the relationship is disputed, prepare the relevant marriage, birth or family record, or selected dated communications and meeting records. Do not send unrelated family members’ information or entire chat histories.'},
      {ko: '함께 예약했거나 다른 사람과 입국했다면 실제 관계, 예약자·결제자, 각자의 일정과 합류·귀국 계획을 설명할 자료를 준비하세요. 초청인이 비용을 부담한다면 아래 자금 자료도 확인하세요.', en: 'For joint bookings or travel with others, document the actual relationship, who booked and paid, each person’s itinerary and plans to meet or leave. If the host pays, also see the funding records below.'},
    ],
    note: {ko: '초청장만으로 입국이 허가되는 것은 아닙니다. 초청인의 확인 내용도 기존 기록과 사실에 맞아야 합니다.', en: 'An invitation does not ensure admission. The host’s account must also be truthful and consistent with existing records.'},
  },
  {
    id: 'purpose',
    title: {ko: '업무·행사·수업·진료·긴급 가족 방문', en: 'Business, events, study, treatment or urgent family visits'},
    purpose: {ko: '방문 목적이 실제 존재하는지, 일정과 상대방을 객관적인 기록으로 확인합니다.', en: 'These records help verify the actual purpose, dates and relevant people or organisations.'},
    items: [
      {ko: '업무·행사: 상대 회사의 초청장과 사업체 확인 자료, 미팅 의제·시간·장소, 담당자 연락처, 기존 이메일, 행사 등록·참가 확인서를 준비하세요.', en: 'Business or events: prepare the counterpart’s invitation and business details, meeting agenda, date, location, contact person, original emails and event registration or attendance confirmation.'},
      {ko: '수업·연수: 실제 등록한 기관의 입학·등록 확인, 과정명·수업 내용·기간·장소·담당자, 납부 영수증과 여행 전 연락을 준비하세요. 해당 활동에 맞는 체류자격인지 별도 확인이 필요합니다.', en: 'Study or training: prepare actual admission or enrolment confirmation, course content, dates, location, organiser contact, payment receipts and pre-trip correspondence. The appropriate immigration status for the activity must be checked separately.'},
      {ko: '진료: 여행 전 예약한 사실과 최초 예약일·진료 예정일시·진료 목적·병원 연락처가 확인되는 자료, 해당하는 경우 예약금 영수증을 준비하세요. 진료·건강 자료는 필요한 범위를 확인하고 별도 동의 안내를 받은 뒤 보내세요.', en: 'Treatment: prepare records confirming the appointment was booked before the trip, its original booking date, scheduled date and time, purpose, clinic contact and any deposit receipt. Send health or treatment records only after the office identifies what is needed and addresses separate consent.'},
      {ko: '장례·위독한 가족 등 긴급 사유: 실제 해당하는 경우에 한하여 사망·장례 일정 또는 필요한 상태 확인 자료와 관계를 보여주는 자료를 준비하세요. 관련 없는 의료기록 전체는 제외하세요.', en: 'A funeral or critically ill family member: only where genuinely applicable, prepare evidence of the death or funeral arrangements, or the relevant condition, plus proof of the relationship. Exclude unrelated medical history.'},
    ],
    note: {ko: '목적을 증명하는 자료가 필요한 사증이나 취업 허가를 대신하지는 않습니다. 실제 하려는 활동을 정확하게 알려주세요.', en: 'Evidence of a purpose does not replace a required visa or permission to work. Describe the activities you actually intend to undertake.'},
  },
  {
    id: 'funding',
    title: {ko: '체류 비용·경비 부담자가 문제인 경우', en: 'Available funds or the person paying questioned'},
    purpose: {ko: '실제로 사용할 수 있는 체류 경비와 그 출처, 실제 비용 부담자를 확인합니다.', en: 'These records help establish the funds actually available for the trip, their source and the real payer.'},
    items: [
      {ko: '본인 부담: 본인 이름·발급일·통화·잔액이 보이는 잔액증명이나 거래내역, 필요한 급여 입금·관련 이체 내역을 준비하세요. 계좌번호는 가리되 검토에 필요한 거래 날짜·금액·당사자 정보는 남기세요.', en: 'Self-funded travel: prepare a bank statement or balance record showing your name, date, currency and balance, with relevant salary or transfer entries where needed. Mask account numbers while retaining the dates, amounts and parties needed for review.'},
      {ko: '가족·초청인 부담: 누가 어떤 비용을 얼마 동안 부담하는지 적은 확인서, 여행자와의 관계, 실제 지급·송금 자료와 필요한 범위의 부담 능력 자료를 준비하세요.', en: 'Family or host funding: prepare a statement identifying who covers which costs and for how long, the relationship, actual payment or transfer records and relevant evidence of the payer’s ability to cover those costs.'},
    ],
    note: {ko: '모든 사건에 적용되는 일정한 최소 잔액이나 거래내역 기간을 제시하는 목록은 아닙니다. 비밀번호, OTP, 카드 전체 번호는 보내지 마세요.', en: 'This is not a universal minimum-balance or statement-period requirement. Never send passwords, one-time codes or full card numbers.'},
  },
  {
    id: 'departure',
    title: {ko: '불법 취업·장기 체류 의심 또는 귀국 계획', en: 'Concerns about work, extended stay or plans to leave'},
    purpose: {ko: '방문 후 돌아갈 실제 생활 기반과 복귀 일정을 확인합니다. 국적 국가와 실제 거주 국가가 다르면 실제로 돌아갈 국가의 자료를 준비하세요.', en: 'These records help show your actual ties outside Korea and return arrangements. If you live outside your country of nationality, use records for the country you actually intend to return to.'},
    items: [
      {ko: '직장: 현재 재직 확인, 승인된 휴가 기간, 복귀 예정일과 확인 가능한 회사 연락처를 준비하세요. 사업자라면 실제 운영 중인 사업과 돌아가 수행할 일정을 보여주는 관련 자료를 고르세요.', en: 'Work: prepare current employment confirmation, approved leave dates, the expected return-to-work date and a verifiable employer contact. For your own business, select records of its actual operation and commitments requiring your return.'},
      {ko: '학업: 재학·학기 일정과 복귀해야 하는 수업·시험 자료를 준비하세요. 해당하는 경우 거주지·체류 자격, 가족 돌봄이나 계속 수행할 의무를 보여주는 관련 자료도 도움이 될 수 있습니다.', en: 'Study: prepare enrolment, term dates and classes or examinations requiring your return. Where relevant, records of residence, immigration status, caregiving or other continuing commitments may also help.'},
      {ko: '원래 발권한 출국 항공권과 다음 목적지에 입국할 자격을 보여주는 자료를 준비하세요. 심사 후 새로 정한 일정은 원래 계획과 구분하세요.', en: 'Prepare your originally issued departure ticket and any evidence of permission to enter the next destination. Distinguish plans made after inspection from your original plans.'},
      {ko: '반복 방문이 문제라면 이전 한국 방문별 입국일·출국일·체류일수·실제 목적을 표로 정리하고 확인 가능한 기존 항공편·출입국 기록을 연결하세요. 방문 횟수만으로 적법 여부를 단정하지 않습니다.', en: 'If repeated visits are questioned, list each prior entry date, departure date, length of stay and actual purpose, supported by existing flight or travel records. Visit counts alone do not determine compliance.'},
    ],
    note: {ko: '직장이나 귀국 항공권이 있다는 사실만으로 입국이 보장되지는 않습니다. 실제 사정과 다른 재직·휴가 확인서를 만들지 마세요.', en: 'Employment or a return ticket alone does not guarantee admission. Do not create employment or leave confirmations that misrepresent your circumstances.'},
  },
  {
    id: 'interview',
    title: {ko: '심사 답변 불일치·오해·통역 문제', en: 'Inconsistent answers, misunderstandings or interpretation issues'},
    purpose: {ko: '어떤 답변이 왜 문제가 되었는지, 당시 자료로 설명할 수 있는 부분을 구분합니다.', en: 'These records help identify the disputed answer and whether existing evidence explains a misunderstanding or discrepancy.'},
    items: [
      {ko: '질문별로 “받은 질문 / 실제 답변 / 통역을 통해 이해한 뜻 / 바로잡아야 할 사실 / 차이가 생긴 이유 / 뒷받침할 자료”를 적으세요. 기억이 불확실하면 그 사실도 표시하세요.', en: 'For each issue, record: question asked / answer actually given / meaning understood through interpretation / factual correction / reason for the difference / supporting record. Identify any uncertainty in your memory.'},
      {ko: '기존 예약, 날짜가 확인되는 이메일·메시지, 초청인 확인 등 실제 답변과 사실을 비교할 수 있는 자료를 준비하세요. 대화 일부를 고르더라도 날짜·발신자·필요한 앞뒤 맥락이 보이게 하세요.', en: 'Prepare existing bookings, dated emails or messages and host confirmations that allow the answer to be checked against the facts. Selected messages should retain dates, senders and the necessary surrounding context.'},
      {ko: '원본은 보관하고 번역·메모는 별도로 붙이세요. 불리해 보이는 내용도 삭제하거나 이야기를 바꾸지 말고 변호사에게 함께 알려주세요.', en: 'Keep originals and add translations or notes separately. Do not delete unfavourable material or change your account; tell the attorney about conflicting evidence too.'},
    ],
    note: {ko: '자료는 사실을 설명하기 위한 것입니다. 심사 때 했던 말을 없었던 일로 만들거나 진술을 맞추기 위한 안내가 아닙니다.', en: 'The purpose is to explain the facts, including contradictions, rather than erase earlier answers or coordinate a new account.'},
  },
  {
    id: 'history',
    title: {ko: '과거 입국불허·체류 위반·형사 사건이 관련된 경우', en: 'Relevant previous refusal, immigration violation or criminal matter'},
    purpose: {ko: '추측한 이력 대신 실제 처분의 사유·내용·결과와 이후 조치를 확인합니다.', en: 'These records help establish what was actually decided, the reasons and outcome, and any later action.'},
    items: [
      {ko: '이전 입국불허·출국명령·강제퇴거 등 실제 받은 통지와 결정문, 관련 사유와 날짜, 과태료·범칙금 등 납부 자료, 실제 출국 사실 자료를 준비하세요.', en: 'Prepare the actual notices or decisions concerning a previous refusal, departure order, deportation or other relevant measure, including reasons and dates, payment records for applicable penalties and evidence of actual departure.'},
      {ko: '형사 문제가 관련되면 구체적 사실·이유·결과가 확인되는 판결문, 약식명령, 불기소 결정·이유 자료 중 해당 자료를 준비하세요. 관련 합의·배상·납부 내역, 이후 달라진 사정, 이전 적법한 단기 방문의 입·출국 날짜도 필요한 범위에서 알려주세요.', en: 'For a relevant criminal matter, prepare the applicable judgment, summary order or non-prosecution decision and reasons showing the underlying facts and outcome. Identify relevant settlement, compensation or payment records, subsequent changes, and dates of prior lawful short visits where needed.'},
    ],
    note: {ko: '무혐의·무죄·벌금 납부만으로 입국 제한이 자동 해제되었다고 판단하지 않습니다. 범죄경력·건강 등 민감한 자료는 별도 동의와 필요한 범위를 먼저 확인합니다.', en: 'No conviction, an acquittal or payment of a fine does not by itself establish that an entry restriction has ended. Confirm the necessary scope and separate consent before sending sensitive criminal or health records.'},
  },
  {
    id: 'route',
    title: {ko: '환승·제주 무사증 등 입국 경로가 쟁점인 경우', en: 'Transit, Jeju visa-free entry or the travel route questioned'},
    purpose: {ko: '실제 이동 경로와 적용받으려는 입국 요건을 함께 확인합니다.', en: 'These records help compare your actual route with the entry conditions you were relying on.'},
    items: [
      {ko: '출발지부터 최종 목적지까지 모든 구간의 발권 내역, 경유 공항·터미널·시간, 수하물 연결 여부에 관한 항공사 안내를 준비하세요.', en: 'Prepare issued tickets for every segment from origin to final destination, connection airports, terminals and times, and any airline instructions about baggage transfers.'},
      {ko: '다음 목적지의 사증·체류 허가와 본인이 적용받는다고 생각한 면제 제도의 정확한 명칭·안내문을 준비하세요. 제주와 다른 국내 지역을 이동할 계획도 사실대로 적으세요.', en: 'Prepare visas or residence permissions for the onward destination and the exact exemption or official guidance you relied on. Describe any intended travel between Jeju and other parts of Korea.'},
    ],
    note: {ko: '환승·무사증 요건은 경로와 사정에 따라 개별 확인이 필요합니다. 제주 입국이 다른 국내 지역으로의 이동 허가를 뜻한다고 전제하지 마세요.', en: 'Transit and visa-free conditions require individual review of the route and circumstances. Do not assume permission to enter Jeju permits travel elsewhere in Korea.'},
  },
  {
    id: 'airline',
    title: {ko: '항공사의 추가 항공권·송환 비용 요구', en: 'An airline’s demand for a new ticket or return costs'},
    purpose: {ko: '누가 무엇을 어떤 근거로 요구했으며, 실제로 지급한 금액이 있는지 확인합니다.', en: 'These records help establish who requested payment, what was requested, the stated basis and whether you paid.'},
    items: [
      {ko: '원래 왕복 항공권과 운임 조건, 새로 제시된 항공편·운임 견적, 청구서·영수증·결제 내역을 준비하세요. 예약만 된 상태와 실제 발권·결제를 구분하세요.', en: 'Prepare the original return ticket and fare terms, the newly offered flight and fare quotation, invoices, receipts and payment records. Distinguish reservations from issued or paid tickets.'},
      {ko: '항공사·출입국이 준 송환 관련 안내, 요구를 받은 날짜·시각, 부서·담당자와 연락 내용을 보관하세요. 문자·이메일이 있으면 원본을 함께 준비하세요.', en: 'Keep return instructions from the airline or immigration authority, the date and time of the request, the department or contact person and the communication. Preserve original messages or emails where available.'},
    ],
    note: {ko: '비용의 근거와 적용 조건을 검토하는 자료입니다. 제출한다고 항공권 대금이 자동 면제되거나 환불되는 것은 아닙니다.', en: 'These records support review of the basis and conditions of the demand. Providing them does not automatically waive or refund airfare.'},
  },
];

export function AirportDocuments({lang, intake = false}: {lang: DocumentLanguage; intake?: boolean}) {
  const ko = lang === 'ko';
  return <section className="kh-section airport-documents" id="documents">
    <h2>{intake ? (ko ? '1. 지금 준비할 서류' : '1. Documents to prepare') : (ko ? '입국불허 사유별 준비서류' : 'Documents for an airport entry refusal')}</h2>
    <p>{ko ? '불허 사유를 확인할 자료와 그 사유를 설명할 기존 증거를 우선 준비하세요. 모든 자료를 모으느라 현재 대응 가능 여부 확인을 늦추지 마세요. 지금 가진 자료부터 시작할 수 있습니다.' : 'Start with records showing the refusal reason and existing evidence addressing it. Do not delay checking current availability while collecting every item. Start with the records you already have.'}</p>
    <p className="er-payment-note">{ko ? '아래는 변호사 검토를 위한 안내이며, 출입국이 정한 공통 필수서류 목록이 아닙니다. 모두 제출할 필요는 없고, 어떤 서류도 입국을 보장하지 않습니다. 이 단계에서는 파일이 전송되지 않습니다.' : 'This is a preparation guide for attorney review, not an official mandatory airport checklist. Not every item is needed, and no document guarantees admission. No files are transmitted at this step.'}</p>
    <h3>{ko ? '먼저 확인할 5가지' : 'Five priorities to prepare first'}</h3>
    <ol className="airport-documents-priority">{priorityDocuments.map((item, index) => <li key={index}>{item[lang]}</li>)}</ol>
    <div className="er-actions"><a className="kh-button" href={intake ? '#application-start' : `/${lang}/entry-refusal/apply`}>{ko ? '가진 자료로 신청 계속하기' : 'Continue with the records you have'}</a></div>
    <p>{ko ? '아래에서 본인에게 해당하는 사유만 펼쳐 확인하세요. 자료가 없거나 발급받을 수 없다면 그 사실을 알려주세요.' : 'Open only the categories relevant to your case. Tell us when a record is unavailable or cannot be obtained.'}</p>
    <div className="airport-documents-groups">{documentGroups.map(group => <details key={group.id} id={`documents-${group.id}`}>
      <summary>{group.title[lang]}</summary>
      <div className="airport-documents-detail">
        <p>{group.purpose[lang]}</p>
        <ul>{group.items.map((item, index) => <li key={index}>{item[lang]}</li>)}</ul>
        <p className="er-payment-note">{group.note[lang]}</p>
      </div>
    </details>)}</div>
    <details className="airport-documents-email">
      <summary>{ko ? '결제 후 이메일을 정리하는 방법' : 'How to organise the email after payment'}</summary>
      <div className="airport-documents-detail">
        <p>{ko ? '서명·결제 후 접수번호를 이메일 제목에 넣어 info@kimnhyun.com으로 보내세요. 신청에 사용한 이메일 주소로 보내면 접수 확인에 도움이 됩니다. 첨부파일은 고객이 이메일에서 직접 선택·발송하며, 홈페이지에서 사건 서류를 업로드하지 않습니다.' : 'After signing and paying, email info@kimnhyun.com with your case reference in the subject. Using the email address from your application helps us match the records. Select and send attachments in your email service; case document files are not uploaded to this website.'}</p>
        <ul>
          <li>{ko ? '파일 이름 예시: 01-notice, 02-flights, 03-visit-purpose, 04-interview-notes, 05-supporting-records. 원래 파일은 보관하고 사본을 정리하세요.' : 'Suggested filenames: 01-notice, 02-flights, 03-visit-purpose, 04-interview-notes, 05-supporting-records. Keep originals and organise copies.'}</li>
          <li>{ko ? '필요한 내용과 날짜가 읽히는 사진·PDF 등 기존 자료를 보내고, 무엇을 보여주는지 국문 또는 영문으로 짧게 설명하세요. 처음부터 모든 자료를 번역·공증할 필요는 없습니다. 추가 번역이 필요한지는 검토 후 안내합니다.' : 'Send existing readable photos, PDFs or other records with relevant contents and dates visible, plus a short Korean or English explanation. You do not need to translate or notarise everything before initial review; the office will identify any further translation needed.'}</li>
          <li>{ko ? '주민등록번호·여권번호·외국인등록번호와 불필요한 타인의 개인정보는 가리세요. 건강·범죄경력 등 민감정보는 사무소에 필요한 범위와 별도 동의를 먼저 확인하세요.' : 'Mask national ID, passport and alien registration numbers and unnecessary information about other people. Confirm the scope and separate consent with the office before sending sensitive health or criminal records.'}</li>
          <li>{ko ? '필요하면 비밀번호로 보호한 첨부파일을 사용할 수 있습니다. 비밀번호는 같은 이메일에 적지 말고 별도 연락 수단으로 전달하세요. 일반 이메일 자체가 더 안전하다는 뜻은 아닙니다.' : 'If appropriate, use password-protected attachments and share the password through a separate contact method, not in the same email. Ordinary email is not inherently more secure.'}</li>
          <li>{ko ? '작성일을 소급하거나 자료를 위조하지 마세요. 기존 예약과 나중에 만든 계획을 구분하고, 모르는 사항은 “모름”으로 적으세요. 이메일 발송과 사무소의 수신 확인은 별개입니다.' : 'Do not backdate or fabricate records. Distinguish existing bookings from later plans and label unknown facts as unknown. Sending an email is separate from the office confirming receipt.'}</li>
        </ul>
        <h3>{ko ? '이메일 본문에 넣을 사실관계 메모' : 'Factual memo for the email body'}</h3>
        <pre className="airport-documents-memo">{ko ? '접수번호:\n현재 공항·터미널 / 연락 가능한 방법:\n입국불허 통지 시각과 들은 사유:\n송환 항공편·출발 예정 시각(KST) / 미정이면 “미정”:\n실제 방문 목적·기간·숙소·초청인:\n경비 부담자 / 원래 출국 계획:\n문제가 된 질문과 실제 답변 / 통역 언어:\n설명이 필요한 차이와 이를 뒷받침할 파일:\n아직 없는 자료·확인되지 않은 사실:' : 'Case reference:\nCurrent airport and terminal / how to reach you:\nRefusal notification time and reason given:\nAssigned return flight and departure time (KST), or “unknown”:\nActual visit purpose, dates, accommodation and host:\nWho pays / originally planned departure:\nDisputed question and actual answer / interpretation language:\nDiscrepancy to explain and the supporting file:\nUnavailable records and facts not yet confirmed:'}</pre>
      </div>
    </details>
    <p className="airport-documents-delivery">{ko ? '서명·결제 후 필요한 서류를 ' : 'After signing and paying, email the necessary records to '}<a href="mailto:info@kimnhyun.com">info@kimnhyun.com</a>{ko ? '으로 보내세요. 사무소가 접수번호와 실제 수신 자료를 확인합니다.' : '. The office checks the case reference and the records actually received.'}</p>
    <p className="er-payment-note">{ko ? '변호사는 불허 사유와 유리·불리한 자료를 함께 검토하고, 약정된 업무 범위·시간 한도 내에서 주된 대응 서면 1건 등 초기 대응을 진행합니다. 모든 신청·제출 절차가 가능한 것은 아니며, 이의 제기만으로 송환이 자동 중단되지는 않습니다. 입국 허가나 송환 중단은 보장하지 않습니다.' : 'The attorney reviews the refusal grounds and supporting or conflicting evidence and provides initial assistance, including one principal response document, within the agreed scope and time limit. Not every submission procedure is available in every case. Raising an objection does not automatically suspend return. Admission or stopping return is not guaranteed.'}</p>
    <p className="airport-documents-sources">{ko ? '근거·참고: ' : 'Basis and reference: '}<a href="https://www.law.go.kr/법령/출입국관리법/제12조" target="_blank" rel="noopener noreferrer">{ko ? '출입국관리법 제12조' : 'Immigration Act, Article 12'}</a>{' · '}<a href="https://www.mofa.go.kr/ng-en/brd/m_23700/view.do?seq=31" target="_blank" rel="noopener noreferrer">{ko ? '주나이지리아 대한민국대사관 입국불허 안내' : 'Korean Embassy in Nigeria: entry-refusal guidance'}</a>{ko ? '. 공식 안내와 개별 사건 자료를 바탕으로 정리한 준비 예시이며, 공항의 일괄 의무 제출 목록은 아닙니다. 확인일: 2026-09-28.' : '. These preparation examples draw on official guidance and individual case materials; they are not a uniform mandatory airport checklist. Reviewed: 28 September 2026.'}</p>
  </section>;
}

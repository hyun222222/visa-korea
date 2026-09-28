import {consultationHref} from '@/lib/brand';

const airports = [
  ['ICN','인천국제공항','Incheon International Airport'],
  ['GMP','김포국제공항','Gimpo International Airport'],
  ['PUS','김해국제공항·부산','Gimhae International Airport, Busan'],
  ['CJU','제주국제공항','Jeju International Airport'],
  ['TAE','대구국제공항','Daegu International Airport'],
  ['CJJ','청주국제공항','Cheongju International Airport'],
  ['MWX','무안국제공항','Muan International Airport'],
  ['YNY','양양국제공항','Yangyang International Airport'],
] as const;

export function EntryUrgent({lang}:{lang:'ko'|'en'}) {
  const ko=lang==='ko';
  return <>
    <section className="kh-section er-urgent" id="airport-help">
      <h2>{ko?'공항 입국불허 긴급 문의':'Urgent airport entry-refusal inquiry'}</h2>
      <p>{ko?'공항 이름과 송환 예정 시각을 알려주세요. 현재 가능한 변호사 상담·대응을 확인합니다. 일반 상담과 구분할 수 있도록 문의 첫 줄에 “공항 입국불허·송환 대기”라고 적어주세요.':'Tell us your airport and scheduled return flight time so we can check available legal assistance. Start your inquiry with “Airport entry refusal — awaiting return” to distinguish it from a routine consultation.'}</p>
      <div className="er-actions"><a className="kh-button" href="#traveler-help">{ko?'본인이 공항에 있습니다':'I am at the airport'}</a><a className="kh-button" href="#family-help">{ko?'가족·초청인이 문의합니다':'I am contacting for someone'}</a></div>
      <p>{ko?'송환이 임박했다면 전화로 대응 가능 여부를 확인하세요. 문의 접수만으로 변호사 배정이나 즉시 대응이 확정되지는 않습니다.':'If your return flight is imminent, call to check availability. Sending an inquiry does not confirm attorney assignment or immediate assistance.'}</p>
      <a href="tel:+82234777600">{ko?'사무소 전화':'Call the office'}: +82-2-3477-7600</a>
    </section>
    <section className="kh-section" id="airports">
      <h2>{ko?'어느 국제공항에서 입국을 거절당했나요?':'Which Korean airport refused your entry?'}</h2>
      <p>{ko?'문의할 때 아래 공항 이름과 터미널, 항공편을 알려주세요. 공항별 현장 방문 가능 여부는 위치·시간·관서 절차를 확인한 뒤 안내합니다.':'Include the airport below, your terminal and flight details. Airport attendance is assessed individually according to location, timing and the applicable procedures.'}</p>
      <ul className="er-airports">{airports.map(([code,korean,english])=><li key={code}><a href="#airport-help">{ko?`${korean} (${code}) 입국불허 상담`:`${english} (${code}) entry refusal`}</a></li>)}</ul>
      <p className="er-payment-note">{ko?'공항 이름은 사건 위치를 확인하기 위한 안내입니다. 각 공항에 상주 사무소가 있거나 모든 공항에 즉시 출동한다는 의미가 아닙니다.':'Airport names identify the location of your case. They do not indicate an airport office or immediate attendance at every airport.'}</p>
    </section>
    <section className="kh-section" id="traveler-help">
      <h2>{ko?'지금 공항에서 송환을 기다리고 있나요?':'Waiting at the airport to be sent back?'}</h2>
      <p>{ko?'서류를 모두 준비할 때까지 기다리지 말고 현재 상황부터 알려주세요.':'Tell us your current situation even if you do not yet have every document.'}</p>
      <ul><li>{ko?'공항·터미널과 현재 단계: 추가 심사 / 입국불허 통지 / 송환 대기':'Airport, terminal and stage: additional inspection / refusal notice / awaiting return'}</li><li>{ko?'송환 항공편과 예정 시각. 모르면 “미정”이라고 알려주세요.':'Return flight and departure time, or “not yet known”.'}</li><li>{ko?'통지서 수령 여부와 연락 가능한 방법':'Whether you have a refusal notice and how we can reach you'}</li></ul>
      <div className="er-actions"><a className="kh-button" href={consultationHref(lang)}>{ko?'공항 상황 전달·상담 가능 여부 문의':'Send an airport inquiry'}</a><a href="#consultation">{ko?'상담 범위·비용·결제 안내':'Scope, fees and payment'}</a></div>
    </section>
    <section className="kh-section" id="family-help">
      <h2>{ko?'가족이나 초청한 사람이 공항에서 나오지 못하고 있나요?':'Is your family member or guest unable to leave arrivals?'}</h2>
      <p>{ko?'본인이 전화하거나 자료를 보내기 어렵다면 가족·초청인이 먼저 문의할 수 있습니다. 현재 공항, 연락 가능한 방법, 송환 예정 시각을 보내주세요.':'If the traveler cannot call or send documents, a family member or host can contact us first. Send the airport, a way to reach you and the scheduled return flight time.'}</p>
      <ul><li>{ko?'본인과의 관계와 현재 연락 가능 여부':'Your relationship to the traveler and whether you can reach them'}</li><li>{ko?'받아둔 통지서와 방문·초청 목적을 설명할 자료':'Any refusal notice and available evidence of the visit or invitation'}</li><li>{ko?'국내 연락 담당자 한 명과 필요한 통역 언어':'One contact person in Korea and any interpretation needs'}</li></ul>
      <p>{ko?'처음에는 상황 개요를 보내주세요. 여권·신분증·형사기록 등은 사무소가 안내하는 방법으로 전달합니다. 필요한 위임 절차는 이후 안내합니다.':'Send a brief summary first. Provide passports, IDs and criminal records only through the method the office specifies. We will explain any authorization requirements.'}</p>
      <div className="er-actions"><a className="kh-button" href={consultationHref(lang)}>{ko?'가족·초청인으로 문의':'Contact as family or host'}</a><a href="#consultation">{ko?'상담 범위·비용·결제 안내':'Scope, fees and payment'}</a></div>
    </section>
  </>;
}

export function EntrySticky({lang}:{lang:'ko'|'en'}) {
  const ko=lang==='ko';
  return <nav className="er-sticky" aria-label={ko?'공항 긴급 상담 바로가기':'Airport assistance shortcuts'}><a href="tel:+82234777600">{ko?'전화 문의':'Call office'}</a><a href="#airport-help">{ko?'공항 긴급 문의':'Airport help'}</a><a href="#consultation">{ko?'비용·결제 안내':'Fees & payment'}</a></nav>;
}

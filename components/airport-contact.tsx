import {airportContact, type AirportContactStage} from '@/lib/airport-contact';
import {KakaoIdButton} from '@/components/kakao-id-button';

const descriptions: Record<AirportContactStage, {ko: string; en: string}> = {
  overview: {
    ko: '접수가 열려 있으면 사전 문의 없이 온라인으로 진행할 수 있습니다. 도움이 필요하면 원하는 방법으로 연락하세요.',
    en: 'When intake is open, you can apply online without contacting the office first. Contact us if you need help.',
  },
  prepare: {
    ko: '준비할 서류가 궁금하면 문의할 수 있습니다. 접수가 열려 있으면 사전 문의 없이도 온라인 접수를 진행할 수 있습니다.',
    en: 'Questions about which documents to prepare? Help is optional. When intake is open, you can continue online without contacting us first.',
  },
  login: {
    ko: '인증 메일이나 로그인에 도움이 필요하면 연락하세요. 온라인 접수를 위해 별도 상담을 받을 필요는 없습니다.',
    en: 'Need help with the sign-in email or login? Contact us here. A separate consultation is not required to apply online.',
  },
  agreement: {
    ko: '업무 범위나 계약 조건이 궁금하면 서명 전에 문의할 수 있습니다. 접수가 열려 있으면 계약을 이해하고 동의한 뒤 온라인 서명을 진행할 수 있습니다.',
    en: 'Ask about the scope or terms before signing if you need help. When intake is open, you can sign online once you understand and accept them.',
  },
  payment: {
    ko: 'PayPal 결제에 도움이 필요하면 연락하세요. 결제 여부가 불분명하면 중복 결제 전에 확인을 요청하세요.',
    en: 'Need help with PayPal? If you are unsure whether payment went through, contact us before paying again.',
  },
  documents: {
    ko: '사건 서류는 info@kimnhyun.com으로 보내 주세요. 서류 전달에 도움이 필요할 때 아래 연락 방법을 이용할 수 있습니다.',
    en: 'Send case documents to info@kimnhyun.com. Use the contact options below if you need help sending them.',
  },
  availability: {
    ko: '현재 온라인 신규 접수와 결제는 열려 있지 않습니다. 문의할 수 있지만 연락만으로 사건 접수나 대응이 확정되지는 않습니다.',
    en: 'New online intake and payment are currently unavailable. You may contact us, but contacting us does not confirm acceptance or assistance.',
  },
};

export function AirportContact({lang, stage = 'overview'}: {lang: 'ko' | 'en'; stage?: AirportContactStage}) {
  const ko = lang === 'ko';
  return <aside className="airport-contact" aria-label={ko ? '도움이 필요할 때 연락' : 'Optional contact support'}>
    <strong>{ko ? '진행 중 도움이 필요하신가요?' : 'Need help at this step?'}</strong>
    <p>{descriptions[stage][lang]}</p>
    <nav className="airport-contact-links" aria-label={ko ? '사무소 연락 방법' : 'Contact the office'}>
      <a href={airportContact.whatsapp} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">WhatsApp</a>
      <KakaoIdButton lang={lang}/>
      <a href={airportContact.email} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">{ko ? '이메일' : 'Email'}</a>
      <a href={airportContact.phone} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">{ko ? '전화' : 'Call'}</a>
    </nav>
    <p className="airport-kakao-help">{ko ? '카카오톡 ID: ' : 'KakaoTalk ID: '}<strong>{airportContact.kakaoId}</strong><br/>{ko ? '카카오톡 → 친구 추가 → ID로 추가에서 검색하세요. 자동 복사가 안 되면 위 ID를 직접 복사하세요.' : 'In KakaoTalk, open Add Friends → Add by ID and search for this ID. If copying is unavailable, select and copy the ID above.'}</p>
    <small>{ko ? '문의 회신 시각과 사건 수임 여부는 사무소 상황에 따라 달라집니다.' : 'Response times and case acceptance depend on office availability.'}</small>
  </aside>;
}

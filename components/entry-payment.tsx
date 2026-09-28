import Link from 'next/link';
export function EntryPayment({lang}:{lang:'ko'|'en'}) {
 const ko=lang==='ko';
 return <div className="kh-note er-checkout"><h3>{ko?'공항 입국불허 긴급 대응':'Airport entry-refusal response'}</h3><p><strong>USD 3,300</strong> · {ko?'변호사 업무 최대 3시간':'Up to 3 hours of attorney work'}</p><p>{ko?'서류 준비 → 사건 정보 입력 → 위임계약 확인·서명 → PayPal 지급 → 비공개 서류 전달':'Prepare documents → Enter case details → Review and sign → PayPal payment → Private document delivery'}</p><p>{ko?'입국 허가·송환 중단 등 특정 결과를 보장하지 않습니다. 접수 가능 상태는 다음 화면에서 확인합니다.':'Admission or suspension of return is not guaranteed. Check current intake availability on the next screen.'}</p><Link className="kh-button" href={`/${lang}/entry-refusal/apply`}>{ko?'서류 준비·계약·결제 절차 확인':'Prepare documents and review the application'}</Link></div>;
}

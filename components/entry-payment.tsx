'use client';
import {useState} from 'react';
import {entryPayment, paymentReady} from '@/lib/entry-payment';
export function EntryPayment({lang}:{lang:'ko'|'en'}) {
  const [accepted,setAccepted]=useState(false);
  if (!paymentReady()) return <div className="kh-note er-checkout"><p>{lang==='ko'?'공항 방문·통역·소송·추가 서면은 별도 계약입니다. 입국 허가나 송환 중단은 보장되지 않습니다.':'Airport attendance, interpretation, litigation and additional documents require a separate agreement. Admission or suspension of return is not guaranteed.'}</p><button className="kh-button" disabled>{lang==='ko'?'USD 3,300 결제 · 연결 준비 중':'Pay USD 3,300 · Not yet available'}</button></div>;
  const ko=lang==='ko',p=entryPayment;
  return <div className="kh-note er-checkout">
    <h3>{ko?'공항 입국불허 긴급 대응 패키지':'Airport entry-refusal response package'}</h3>
    <p><strong>{p.displayPrice}</strong> · {p.duration[lang]} · {p.languages[lang]}</p>
    <p>{p.delivery[lang]}</p><p>{p.refundTerms[lang]}</p>
    <p>{ko?'결제 후 사무소가 거래와 상담 일정을 확인합니다. PayPal 결제화면 이동만으로 결제 완료가 확인되지는 않습니다.':'The office verifies the transaction and consultation schedule after payment. Opening PayPal does not confirm payment.'}</p>
    <label><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/> {ko?'상담 범위, 비용, 일정 및 환불 조건을 확인했습니다. 결제만으로 입국 허가나 송환 중단이 보장되지 않음을 이해합니다.':'I have reviewed the scope, fee, schedule and refund terms. Payment does not guarantee admission or suspension of return.'}</label>
    <p>{accepted?<a className="kh-button" href={p.checkoutUrl} rel="noreferrer">{ko?'USD 3,300 바로 결제':'Pay USD 3,300 on PayPal'} ↗</a>:<button className="kh-button" disabled>{ko?'위 조건을 확인해 주세요':'Review the terms above'}</button>}</p>
  </div>;
}

'use client';
import {useState} from 'react';
import {entryPayment, paymentReady} from '@/lib/entry-payment';
export function EntryPayment({lang}:{lang:'ko'|'en'}) {
  const [accepted,setAccepted]=useState(false);
  if (!paymentReady()) return null;
  const ko=lang==='ko',p=entryPayment;
  return <div className="kh-note er-checkout">
    <h3>{ko?'입국불허 자료 검토 상담':'Entry-refusal document review consultation'}</h3>
    <p><strong>{p.displayPrice}</strong> · {p.duration[lang]} · {p.languages[lang]}</p>
    <p>{p.delivery[lang]}</p><p>{p.refundTerms[lang]}</p>
    <p>{ko?'결제 후 사무소가 거래와 상담 일정을 확인합니다. PayPal 결제화면 이동만으로 결제 완료가 확인되지는 않습니다.':'The office verifies the transaction and consultation schedule after payment. Opening PayPal does not confirm payment.'}</p>
    <label><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/> {ko?'상담 범위, 비용, 일정 및 환불 조건을 확인했습니다. 결제만으로 입국 허가나 송환 중단이 보장되지 않음을 이해합니다.':'I have reviewed the scope, fee, schedule and refund terms. Payment does not guarantee admission or suspension of return.'}</label>
    <p>{accepted?<a className="kh-button" href={p.checkoutUrl} rel="noreferrer">{ko?'PayPal에서 상담료 결제':'Pay consultation fee on PayPal'} ↗</a>:<button className="kh-button" disabled>{ko?'위 조건을 확인해 주세요':'Review the terms above'}</button>}</p>
  </div>;
}

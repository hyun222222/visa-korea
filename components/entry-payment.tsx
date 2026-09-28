import Link from 'next/link';
export function EntryPayment({lang}:{lang:'ko'|'en'}) {
 const ko=lang==='ko';
 return <div className="kh-note er-checkout"><h3>{ko?'어떤 도움을 받나요?':'What does the package include?'}</h3><p><strong>USD 3,300</strong> · {ko?'변호사 업무 합계 최대 3시간':'Up to 3 hours of attorney work in total'}</p>
 <ul>
  <li>{ko?'입국불허 사유와 핵심자료 검토, 사실관계 확인 통화 1회':'Review of refusal reasons and key records, with one fact-finding call'}</li>
  <li>{ko?'사건에 맞는 주된 대응 서면 1건 작성: 이의신청 문안·설명서·변호사 의견서 등 중 적절한 서면':'One principal response document suited to the case, such as an objection draft, explanation or attorney opinion'}</li>
  <li>{ko?'제출 방법 안내 및 가능한 범위의 초기 연락, 수행 업무·다음 조치 종료 보고':'Submission guidance and initial contact where feasible, plus a closing report on work done and next steps'}</li>
 </ul>
 <p>{ko?'접수가 열려 있고 계약 동의·결제·필수정보 제출을 마치면 30분 안에 첫 연락을 합니다. 사무소 사정으로 지키지 못하면 계약 해지와 전액 환불을 요청할 수 있습니다. 첫 연락은 입국 허가나 사건 해결을 뜻하지 않습니다.':'When intake is open, first contact is due within 30 minutes after contract acceptance, payment and required information are complete. If the office misses this for reasons attributable to it, you may terminate and request a full refund. First contact does not mean admission or resolution.'}</p>
 <p>{ko?'공항 방문·통역·소송·추가 서면 및 한도를 넘는 업무는 별도 합의입니다. 서면 접수·기관 회신·송환 중단은 보장하지 않습니다. 취소·환불 기준은 결제 전 위임계약서에서 확인할 수 있습니다.':'Airport attendance, interpretation, litigation, additional documents and work beyond the limit require a separate agreement. Acceptance of documents, an authority’s response and suspension of return are not guaranteed. Review cancellation and refund terms in the agreement before payment.'}</p>
 <p>{ko?'사전 유료 상담 없이 온라인 의뢰도 가능합니다. 사건 정보 입력 → 위임계약 확인·서명 → PayPal 지급 → 이메일로 사건 서류 전달':'You can also engage online without buying a preliminary consultation. Enter case details → Review and sign → PayPal payment → Email case documents'}</p><p>{ko?'입국 허가·송환 중단 등 특정 결과를 보장하지 않습니다. 접수 가능 상태는 다음 화면에서 확인합니다.':'Admission or suspension of return is not guaranteed. Check current intake availability on the next screen.'}</p><Link className="kh-button" href={`/${lang}/entry-refusal/apply`}>{ko?'업무·계약 확인 후 온라인 의뢰':'Review agreement & apply online'}</Link></div>;
}

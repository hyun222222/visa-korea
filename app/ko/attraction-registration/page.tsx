import {LegalServicePage, type ServiceCopy} from '@/components/legal-service-page';
const copy:ServiceCopy = {
  "title": "외국인환자 유치 등록: 기관별 요건과 갱신 확인",
  "intro": "유치의료기관과 유치사업자의 등록 요건을 나누고, 출입국민원 대행기관 등록과도 구별합니다.",
  "sections": [
    [
      "등록기관과 법적 근거",
      "의료해외진출법 제6조는 외국인환자를 유치하려는 의료기관과 그 밖의 사업자가 시·도지사에게 등록하도록 정합니다. 보건복지부에 직접 등록하는 제도로 일률적으로 설명하지 않습니다."
    ],
    [
      "의료기관과 사업자의 요건",
      "의료기관은 진료과목별 전문의 요건과 의료사고배상책임보험·공제 가입 등을 확인합니다. 유치사업자는 보증보험, 자본금, 국내 사무소 요건을 적용 기준에 따라 확인합니다. 두 유형의 보험을 동일한 상품·금액으로 안내하지 않습니다."
    ],
    [
      "유효기간과 별도 지정",
      "제6조상 등록 유효기간은 3년이며 계속 유치하려면 만료 전 갱신이 필요합니다. 유치 등록 자체가 모든 전자비자 대리신청 권한이나 우수기관 지정을 자동으로 부여하지는 않습니다."
    ],
    [
      "상담 전에 준비할 자료",
      "기관 유형, 사업자·법인 자료, 기존 등록증, 보험·공제 증서, 자본금·사무소 자료와 갱신 일정을 준비하세요. 필요한 등록·변경·갱신 절차와 위임 범위를 먼저 확인합니다."
    ]
  ],
  "sources": [
    [
      "의료해외진출법 제6조",
      "https://www.law.go.kr/법령/의료해외진출및외국인환자유치지원에관한법률/제6조"
    ],
    [
      "KHIDI Registration System",
      "https://www.medicalkorea.or.kr/en/registeredsystem"
    ]
  ],
  "lang": "ko"
};
export default function Page(){return <LegalServicePage copy={copy}/>;}

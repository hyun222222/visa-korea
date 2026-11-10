import {LegalServicePage, type ServiceCopy} from '@/components/legal-service-page';
const copy:ServiceCopy = {
  "title": "Korean Medical Visas: Application Routes and Evidence",
  "intro": "Review the treatment plan, intended stay and application route before preparing C-3-3 or G-1-10 documents.",
  "sections": [
    [
      "Direct application or facilitator route",
      "KHIDI distinguishes a patient’s direct application to a Korean consular office from an application through a facilitator. An invitation or guarantee from a registered facilitator is not a universal condition for every medical visa."
    ],
    [
      "Stay period and documents",
      "Official guidance describes C-3-3 within 90 days and G-1-10 within one year. Those limits do not promise a particular grant or extension. Prepare diagnosis and treatment-booking records, funding evidence and any additional documents required for your route."
    ],
    [
      "If the application is refused",
      "Keep the decision, date received and previous application documents. Overseas visa refusal, airport entry refusal and an in-country status decision require different procedural assessments. A fresh application does not by itself suspend a challenge deadline."
    ],
    [
      "Arrange a document review",
      "Explain your nationality, current location, stay expiry date and treatment schedule. The office will explain the consultation scope, fees and document-sharing method before requesting sensitive records."
    ]
  ],
  "sources": [
    [
      "KHIDI Medical Korea: Medical Visa",
      "https://www.medicalkorea.or.kr/en/medicalvisa"
    ]
  ],
  "lang": "en"
};
export default function Page(){return <LegalServicePage copy={copy}/>;}

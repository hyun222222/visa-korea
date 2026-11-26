import {shareMetadata} from '@/lib/share-metadata';

const title = "SNS 의료광고 사전심의·처분 대응 | 김앤현 법률사무소";
const description = "외국인환자 유치와 의료 SNS 광고를 검토할 때 확인할 자료와 상담 안내.";
const url = '/ko/sns-medical-ad-compliance';
export const metadata = {
  title, description, alternates: {canonical: url},
  ...shareMetadata({title, description, url}),
};
export default function Layout({children}:{children:React.ReactNode}){return children;}

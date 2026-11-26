import {shareMetadata} from '@/lib/share-metadata';

const title = "의료비자 불허·체류자격 변경 불허 대응 | 김앤현";
const description = "의료 목적 입국·체류 불허 사유와 준비자료를 검토하는 상담 안내.";
const url = '/ko/medical-visa-remedy';
export const metadata = {
  title, description, alternates: {canonical: url},
  ...shareMetadata({title, description, url}),
};
export default function Layout({children}:{children:React.ReactNode}){return children;}

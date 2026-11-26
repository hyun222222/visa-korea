import {shareMetadata} from '@/lib/share-metadata';

const title = "외국인환자 유치업 등록·갱신 검토 | 김앤현 법률사무소";
const description = "외국인환자 유치업 등록을 준비할 때 확인할 자료와 법률상담 안내.";
const url = '/ko/attraction-registration';
export const metadata = {
  title, description, alternates: {canonical: url},
  ...shareMetadata({title, description, url}),
};
export default function Layout({children}:{children:React.ReactNode}){return children;}

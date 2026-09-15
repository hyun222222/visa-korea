import VisaHome from '@/components/visa-home';
import copy from '@/lib/home-copy.json';
import {visaOrigin,languages} from '@/lib/brand';
export const metadata={title:'비자·출입국 상담 | 김앤현 법률사무소',description:copy.ko.intro,alternates:{canonical:visaOrigin+'/ko',languages:Object.fromEntries(languages.map(l=>[l,visaOrigin+'/'+l]))}};
export default function Page(){return <VisaHome lang="ko"/>;}

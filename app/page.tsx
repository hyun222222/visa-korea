import {localizedAlternates, shareMetadata} from '@/lib/share-metadata';
import VisaHome from '@/components/visa-home';
import copy from '@/lib/home-copy.json';
const title = '비자·출입국 상담 | 김앤현 법률사무소';
const description = copy.ko.intro;
export const metadata = {
  title, description,
  alternates: {canonical: '/ko', languages: localizedAlternates(lang => `/${lang}`)},
  ...shareMetadata({title, description, url: '/ko'}),
};
export default function Page(){return <VisaHome lang="ko"/>;}

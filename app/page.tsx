import {localizedAlternates, shareMetadata} from '@/lib/share-metadata';
import VisaHome from '@/components/visa-home';
import copy from '@/lib/home-copy.json';
const title = copy.ko.searchTitle;
const description = copy.ko.intro;
export const metadata = {
  title, description,
  alternates: {canonical: '/ko', languages: localizedAlternates(lang => `/${lang}`)},
  ...shareMetadata({title, description, url: '/ko'}),
};
export default function Page(){return <VisaHome lang="ko"/>;}

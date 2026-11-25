import {shareMetadata} from '@/lib/share-metadata';

const title = "Medical treatment visas in Korea | Kim & Hyun";
const description = "Preparation and legal consultation for medical treatment and related entry arrangements.";
const url = '/en/medical-visa-korea';
export const metadata = {
  title, description, alternates: {canonical: url},
  ...shareMetadata({title, description, url}),
};
export default function Layout({children}:{children:React.ReactNode}){return children;}

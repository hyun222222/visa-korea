import {shareMetadata} from '@/lib/share-metadata';

const title = "Visa refusal: reviewing the reasons and next steps | Kim & Hyun";
const description = "How to prepare a refusal notice and supporting documents for an immigration consultation.";
const url = '/en/visa-refusal-remedy';
export const metadata = {
  title, description, alternates: {canonical: url},
  ...shareMetadata({title, description, url}),
};
export default function Layout({children}:{children:React.ReactNode}){return children;}

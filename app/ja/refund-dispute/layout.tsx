import {shareMetadata} from '@/lib/share-metadata';

const title = "韓国での医療費返金トラブル | Kim & Hyun";
const description = "医療費返金の相談に必要な契約・支払・連絡記録をご案内します。";
const url = '/ja/refund-dispute';
export const metadata = {
  title, description, alternates: {canonical: url},
  ...shareMetadata({title, description, url}),
};
export default function Layout({children}:{children:React.ReactNode}){return children;}

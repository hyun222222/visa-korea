import {shareMetadata} from '@/lib/share-metadata';

const title = "韩国医疗费用退款争议 | Kim & Hyun";
const description = "说明医疗费用退款争议中需要核对的合同、付款和沟通记录。";
const url = '/zh/refund-dispute';
export const metadata = {
  title, description, alternates: {canonical: url},
  ...shareMetadata({title, description, url}),
};
export default function Layout({children}:{children:React.ReactNode}){return children;}

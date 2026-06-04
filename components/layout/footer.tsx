import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t bg-slate-50">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-slate-900">김앤현 법률사무소</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            한국 비자·이민·법인설립 법률사무소입니다.<br />
                            외국인 투자자와 체류 외국인의 합법적 정착을 돕습니다.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-slate-900">연락처</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>Attorney: Kim Hyun-jung</li>
                            <li>Tel: +82 10-5534-6843</li>
                            <li>Address: 16 Beobwon-ro, Seocho-gu, Seoul, South Korea</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-slate-900">서비스 안내</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link href="/check" className="hover:text-blue-600 transition-colors">자격 자가 진단</Link></li>
                            <li><Link href="/apply" className="hover:text-blue-600 transition-colors">신청서 작성</Link></li>
                            <li><Link href="/blog" className="hover:text-blue-600 transition-colors">블로그</Link></li>
                            <li><Link href="/board" className="hover:text-blue-600 transition-colors">게시판</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t pt-8 text-center text-xs text-slate-400">
                    <p>&copy; {new Date().getFullYear()} 김앤현 법률사무소 (Kim&Hyun Law Office). All rights reserved.</p>
                    <p className="mt-2">
                        본 사이트에서 제공하는 정보는 일반적인 법률 정보이며, 구체적인 사안에 대한 법률적 자문이 아닙니다.
                    </p>
                </div>
            </div>
        </footer>
    );
}

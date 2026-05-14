import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "바로소 | 집단소송 플랫폼 - 혼자면 포기하지만, 뭉치면 승소합니다",
  description: "집단소송, 소비자 피해, 개인정보 유출, 아파트 하자 — 같은 피해를 입은 사람들과 함께 소송에 참여하세요. 바로소는 김앤현 법률사무소가 운영하는 집단 소송 플랫폼입니다.",
  keywords: ["집단소송", "집단소송 플랫폼", "소비자 피해", "개인정보 유출 소송", "아파트 하자 소송", "바로소", "김앤현 법률사무소"],
  authors: [{ name: "김앤현 법률사무소" }],
  creator: "김앤현 법률사무소",
  publisher: "김앤현 법률사무소",
  metadataBase: new URL('https://www.balawso.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "바로소 | 집단소송 플랫폼 - 뭉치면 승소합니다",
    description: "같은 피해, 같은 분노 — 혼자 포기하지 마세요. 지금 바로 동료를 찾고 함께 소송에 참여하세요.",
    url: 'https://www.balawso.com',
    siteName: '바로소 (BAROSO)',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '바로소 - 집단소송 플랫폼',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "바로소 | 집단소송 플랫폼",
    description: "혼자면 포기하지만, 뭉치면 승소합니다. 같은 피해자를 찾고 함께 소송하세요.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LegalService",
              "name": "바로소 (BAROSO) - 김앤현 법률사무소",
              "description": "집단소송, 소비자 피해, 개인정보 유출, 아파트 하자 소송을 위한 집단 소송 플랫폼. 같은 피해를 입은 사람들과 함께 권리를 찾으세요.",
              "url": "https://www.balawso.com",
              "telephone": "+82-10-5534-6843",
              "email": "info@kimnhyun.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Seoul",
                "addressCountry": "KR"
              },
              "priceRange": "$$",
              "areaServed": {
                "@type": "Country",
                "name": "South Korea"
              },
              "serviceType": ["집단소송", "소비자 피해 소송", "개인정보 유출 소송", "아파트 하자 소송"],
              "logo": "https://www.balawso.com/logo.png"
            })
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        {/* Google tag (gtag.js) - Using Next.js Script component */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-10796244873"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-10796244873');
          `}
        </Script>

        <div className="flex min-h-screen flex-col bg-slate-50">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

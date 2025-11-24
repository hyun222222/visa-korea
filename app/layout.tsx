import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Korea Visa Law | Immigration Attorney in Seoul - Kim&Hyun Law Office",
  description: "Professional Korean immigration law services. Specializing in visa applications, residence permits, permanent residence (F-5), work visas (E-7), and naturalization. Licensed attorneys in Seoul, South Korea.",
  keywords: ["Korea visa", "Korean immigration lawyer", "Seoul attorney", "F-5 visa", "E-7 visa", "F-2 visa", "permanent residence Korea", "work visa Korea", "immigration law Seoul"],
  authors: [{ name: "Kim&Hyun Law Office" }],
  creator: "Kim&Hyun Law Office",
  publisher: "Kim&Hyun Law Office",
  metadataBase: new URL('https://koreavisalaw.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Korea Visa Law | Immigration Attorney - Kim&Hyun Law Office",
    description: "Professional Korean immigration law services. Licensed attorneys specializing in visa applications, residence permits, and naturalization in Seoul.",
    url: 'https://koreavisalaw.com',
    siteName: 'Kim&Hyun Law Office',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kim&Hyun Law Office - Korean Immigration Lawyers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Korea Visa Law | Immigration Attorney",
    description: "Professional Korean immigration law services in Seoul",
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
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-10796244873"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-10796244873');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LegalService",
              "name": "Kim&Hyun Law Office",
              "description": "Professional legal services in Korean immigration law, specializing in visa applications, residence permits, and naturalization matters.",
              "url": "https://koreavisalaw.com",
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
              "serviceType": ["Immigration Law", "Visa Services", "Legal Consultation"],
              "logo": "https://koreavisalaw.com/logo.png"
            })
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <div className="flex min-h-screen flex-col bg-slate-50">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

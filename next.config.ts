import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [{source: '/medical-visa', destination: '/ko/medical-visa', statusCode: 301 as const}, ...(['en', 'zh', 'ja'] as const).map(lang => ({
      // Stable legacy article addresses: one HTTP 301 hop, including query strings.
      source: `/blog/d8-visa-rejection-reasons-${lang}`,
      destination: `https://koreavisalaw.com/${lang}/blog/d8-visa-rejection-reasons-${lang}`,
      statusCode: 301 as const,
    })), {
      source: '/:path*',
      has: [{ type: 'host', value: 'www.koreavisalaw.com' }],
      destination: 'https://koreavisalaw.com/:path*',
      permanent: true,
    }];
  },
};

export default nextConfig;

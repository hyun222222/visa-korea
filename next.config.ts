import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [{
      source: '/:path*',
      has: [{ type: 'host', value: 'www.koreavisalaw.com' }],
      destination: 'https://koreavisalaw.com/:path*',
      permanent: true,
    }];
  },
};

export default nextConfig;

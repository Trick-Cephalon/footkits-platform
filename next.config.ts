import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BACKEND_URL: process.env.BACKEND_URL ?? 'http://localhost:3001',
  },
  async rewrites() {
    return [
      // Proxy direto /api/v1/* → backend (alternativa às route handlers)
      {
        source: '/api/v1/:path*',
        destination: `${process.env.BACKEND_URL ?? 'http://localhost:3001'}/api/v1/:path*`,
      },
    ]
  },
};

export default nextConfig;

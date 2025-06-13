import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignores ESLint errors during AWS Amplify builds
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Ignores TypeScript errors during production builds
  },
};

export default nextConfig;
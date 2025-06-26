import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignores ESLint errors during AWS Amplify builds
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Ignores TypeScript errors during production builds
  },
  // Add React strict mode for better error detection
  reactStrictMode: true,
  // Optimize for production
  // Add experimental features for better React 18 support
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'lucide-react'],
  },
  // Webpack configuration to handle Node.js modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle Node.js modules on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
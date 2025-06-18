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
  // Ensure proper transpilation for Spline
  transpilePackages: ['@splinetool/react-spline'],
  // Optimize for production
  swcMinify: true,
  // Add experimental features for better React 18 support
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'lucide-react'],
  },
  // Webpack configuration to handle Spline
  webpack: (config, { isServer }) => {
    // Handle Spline package properly
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        chunks: 'all',
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          spline: {
            test: /[\\/]node_modules[\\/]@splinetool[\\/]/,
            name: 'spline',
            chunks: 'all',
            priority: 10,
          },
        },
      },
    };
    
    return config;
  },
};

export default nextConfig;
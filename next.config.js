 /** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // Allow builds to succeed even if there are ESLint errors
      ignoreDuringBuilds: true,
    },
    typescript: {
      // Allow builds to succeed even if there are TS type errors
      ignoreBuildErrors: true,
    },
  };
  
  module.exports = nextConfig;
  
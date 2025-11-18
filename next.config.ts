import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-select', '@radix-ui/react-progress'],
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Turbopack configuration (for Next.js 16+)
  turbopack: {
    // Enable optimizations for production builds
  },
};

export default nextConfig;

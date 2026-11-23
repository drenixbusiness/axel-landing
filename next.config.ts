import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // put the (small) stylesheets straight into the HTML: no render-blocking CSS requests
    inlineCss: true,
  },
};

export default nextConfig;

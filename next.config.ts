import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.saifabdelfattah.net",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;

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
    ],
  },
};

export default nextConfig;

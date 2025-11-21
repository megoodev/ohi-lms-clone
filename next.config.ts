import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "ohilmsvone.t3.storage.dev",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;

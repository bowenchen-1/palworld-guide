import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "assets.palworldguide.net", pathname: "/**" }],
  },
};

export default nextConfig;

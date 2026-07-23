import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: "/map/palpagos-z4/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/map/world-tree-z3/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.palworldguide.net", pathname: "/**" },
      { protocol: "https", hostname: "cdn.palworldguide.net", pathname: "/**" },
    ],
  },
};

export default nextConfig;

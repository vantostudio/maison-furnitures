import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The catalog points at Unsplash URLs that already carry their own width and
    // quality params, so routing them through the Next optimizer only adds a
    // server-side round trip. The browser fetches them directly instead.
    unoptimized: true,
  },
};

export default nextConfig;

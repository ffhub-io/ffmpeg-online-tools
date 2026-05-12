import type { NextConfig } from "next";

// ffmpeg.wasm 0.12+ needs SharedArrayBuffer, which browsers only enable in a
// cross-origin isolated context. Sending COOP + COEP on every route turns
// isolation on globally so the wasm core can boot.
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
};

export default nextConfig;

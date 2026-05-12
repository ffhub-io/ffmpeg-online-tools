import type { NextConfig } from "next";

// ffmpeg.wasm 0.12+ 需要 SharedArrayBuffer，浏览器只在跨域隔离环境里启用它，
// 必须发 COOP / COEP 头。这套配置让全站默认拿到 isolation，wasm 才能跑。
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

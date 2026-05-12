import type { MetadataRoute } from "next";

// PWA / 安卓主屏 / Chrome 安装 提示用到。Next.js 会从这里生成
// /manifest.webmanifest 并在 <head> 注入 <link rel="manifest">。
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FFmpeg Online Tools",
    short_name: "FFmpeg Online",
    description:
      "Free in-browser FFmpeg toolkit — convert video to MP3, compress, trim, extract audio. Powered by ffmpeg.wasm.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    icons: [
      { src: "/branding/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/branding/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/branding/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

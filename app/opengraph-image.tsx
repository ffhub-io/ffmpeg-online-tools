import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "FFmpeg Online Tools — free in-browser FFmpeg toolkit";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
          color: "white",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 32, opacity: 0.7, marginBottom: 24 }}>
          ffmpeg-online-tools.vercel.app
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
            marginBottom: 32,
          }}
        >
          <span>Run FFmpeg</span>
          <span style={{ color: "#60a5fa" }}>online</span>
        </div>
        <div style={{ fontSize: 36, opacity: 0.85, lineHeight: 1.3, maxWidth: 900 }}>
          Free in-browser toolkit — convert video to MP3, compress, trim, extract audio.
          No upload, no signup.
        </div>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            gap: 24,
            fontSize: 26,
            opacity: 0.6,
          }}
        >
          <span>ffmpeg.wasm</span>
          <span>·</span>
          <span>Open source</span>
          <span>·</span>
          <span>Runs locally in your browser</span>
        </div>
      </div>
    ),
    size,
  );
}

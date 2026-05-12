import type { Metadata } from "next";

import { VideoToMp3Content } from "./video-to-mp3-content";

export const metadata: Metadata = {
  title: "Video to MP3 Converter Online — Free, In-Browser",
  description:
    "Convert any video to MP3 right in your browser via ffmpeg.wasm. Pick a quality preset (320k / 192k / 128k), download in seconds. No upload, no signup.",
  alternates: { canonical: "/video-to-mp3" },
};

export default function Page() {
  return <VideoToMp3Content />;
}

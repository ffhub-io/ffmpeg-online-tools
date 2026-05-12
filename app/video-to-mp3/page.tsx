import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";

import { VideoToMp3Content } from "./video-to-mp3-content";

export const metadata: Metadata = {
  title: "Video to MP3 Converter Online — Free, In-Browser",
  description:
    "Convert any video to MP3 right in your browser via ffmpeg.wasm. Pick a quality preset (320k / 192k / 128k), download in seconds. No upload, no signup.",
  alternates: { canonical: "/video-to-mp3" },
};

// FAQPage schema — lets Google show the FAQs as a rich snippet (folding panels)
// directly in search results. Q&A text must match what's actually rendered.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Which bitrate should I pick?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "320 kbps for music you care about. 192 kbps is the music sweet spot — most people can't tell it apart from 320k. 128 kbps for podcasts, lectures, audiobooks where speech clarity matters more than fidelity.",
      },
    },
    {
      "@type": "Question",
      name: "Does my video get uploaded?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Everything runs in your browser via ffmpeg.wasm. The video never leaves your device, and this site has no server-side storage at all.",
      },
    },
    {
      "@type": "Question",
      name: "What about YouTube videos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "YouTube doesn't let you download videos directly. Use yt-dlp or another tool to grab the video file first, then drop it here.",
      },
    },
    {
      "@type": "Question",
      name: "My file is huge — what now?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Above ~500 MB the browser will struggle. Try the cloud version at ffhub.io — same FFmpeg, no upload limit.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <VideoToMp3Content />
    </>
  );
}

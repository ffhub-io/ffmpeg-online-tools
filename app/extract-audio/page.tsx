import type { Metadata } from "next";

import { ExtractAudioContent } from "./extract-audio-content";

export const metadata: Metadata = {
  title: "Extract Audio from Video Online — MP3 / AAC / Opus / FLAC",
  description:
    "Pull the audio track out of any video, right in your browser. MP3 320k, AAC, Opus for podcasts, or lossless FLAC. No upload.",
  alternates: { canonical: "/extract-audio" },
};

export default function Page() {
  return <ExtractAudioContent />;
}

import type { Metadata } from "next";

import { CompressContent } from "./compress-content";

export const metadata: Metadata = {
  title: "Compress Video Online — H.264, In-Browser, No Upload",
  description:
    "Shrink any video right in your browser via ffmpeg.wasm. Three CRF presets balance size and quality. No upload, no signup.",
  alternates: { canonical: "/compress" },
};

export default function Page() {
  return <CompressContent />;
}

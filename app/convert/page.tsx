import type { Metadata } from "next";

import { ConvertContent } from "./convert-content";

export const metadata: Metadata = {
  title: "Convert Video Format Online — MP4 / WebM / MKV / MOV",
  description:
    "Switch video containers in your browser. MP4, WebM, MKV, MOV — fast lossless remux when codecs are compatible.",
  alternates: { canonical: "/convert" },
};

export default function Page() {
  return <ConvertContent />;
}

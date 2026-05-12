import Link from "next/link";
import { ArrowRight, Cloud, Lock, Zap } from "lucide-react";

const TOOLS = [
  {
    href: "/video-to-mp3",
    title: "Video to MP3",
    desc: "Save the audio from a video as MP3. Three quality presets.",
  },
  {
    href: "/extract-audio",
    title: "Extract audio",
    desc: "Pull the audio track out — MP3, AAC, Opus, or lossless FLAC.",
  },
  {
    href: "/compress",
    title: "Compress video",
    desc: "Shrink a video with H.264, balanced presets for size vs quality.",
  },
  {
    href: "/convert",
    title: "Convert format",
    desc: "Switch between MP4, WebM, MKV, MOV. Just a container swap.",
  },
];

const FEATURES = [
  {
    Icon: Lock,
    title: "Your files stay on your device",
    desc: "Everything runs in the browser via ffmpeg.wasm. Nothing uploads anywhere.",
  },
  {
    Icon: Zap,
    title: "Real FFmpeg, no fake",
    desc: "Same encoders and parameters as the FFmpeg you'd run locally — just no install needed.",
  },
  {
    Icon: Cloud,
    title: "Outgrow it? There's an API",
    desc: "For big files, batch jobs, or automation, the same tools run on the cloud at ffhub.io.",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <section className="py-12 text-center sm:py-20">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Run FFmpeg online — free, in your browser
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Four common FFmpeg tools (MP3 export, audio extract, compress, format convert) with sensible
          presets. No upload, no signup, no watermark. Powered by ffmpeg.wasm.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-500">
          Best for files under 500 MB — larger files freeze the browser tab.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Tools</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group rounded-lg border bg-white p-5 transition-colors hover:border-gray-900 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="text-base font-semibold">{tool.title}</div>
                <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-900" />
              </div>
              <div className="mt-1 text-sm text-gray-600">{tool.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Why</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div key={title} className="rounded-lg border bg-white p-5">
              <Icon className="h-5 w-5 text-gray-500" />
              <div className="mt-3 text-sm font-semibold">{title}</div>
              <div className="mt-1 text-sm text-gray-600">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12 rounded-lg border bg-white p-6">
        <h2 className="text-base font-semibold">Browser limits</h2>
        <p className="mt-2 text-sm text-gray-600">
          Everything runs inside your browser tab via WebAssembly. That has a few practical
          consequences worth knowing:
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
          <li>• Files above 500 MB are rejected — they tend to peg the CPU and freeze the tab</li>
          <li>• Codecs are limited to whatever the default ffmpeg-core wasm build ships
            (H.264, VP9, MP3, AAC, Opus, FLAC, etc.). H.265 / AV1 are not included.</li>
          <li>• One file at a time; no batch mode</li>
        </ul>
      </section>
    </div>
  );
}

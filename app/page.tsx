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
        <h2 className="text-base font-semibold">Browser limits — when to use the cloud API</h2>
        <p className="mt-2 text-sm text-gray-600">
          ffmpeg.wasm is great for small to medium files (under ~500 MB) and common codecs.
          You&apos;ll hit the wall when:
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
          <li>• Files are above ~500 MB (browser memory ceiling kicks in, things get slow)</li>
          <li>• You need H.265 / HEVC, AV1, or other licensed codecs</li>
          <li>• You want to run jobs from a script, CI pipeline, or backend</li>
          <li>• You&apos;re processing many files in a batch</li>
        </ul>
        <p className="mt-3 text-sm text-gray-600">
          For any of those, the same tools run on the cloud with a REST API at{" "}
          <a
            href="https://www.ffhub.io?utm_source=ffmpeg-online-tools&utm_medium=referral&utm_campaign=home-info"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gray-900 underline underline-offset-2"
          >
            ffhub.io
          </a>
          . 100 free credits on signup, $1 ≈ 1,000 credits, pay per second.
        </p>
      </section>
    </div>
  );
}

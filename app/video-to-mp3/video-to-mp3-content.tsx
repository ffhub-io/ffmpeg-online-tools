"use client";

import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { FFHubCTA } from "@/components/ffhub-cta";
import { FileInput } from "@/components/file-input";
import { OutputCard } from "@/components/output-card";
import { PresetCard } from "@/components/preset-card";
import { runFFmpeg } from "@/lib/ffmpeg-runner";

// Files above this size show a "try the cloud version" hint. 500MB is roughly
// the practical ceiling for ffmpeg.wasm in a browser tab — beyond that the
// run gets slow and prone to OOM.
const SIZE_WARN_BYTES = 500 * 1024 * 1024;

type PresetKey = "high" | "standard" | "small";
const PRESET_KEYS: PresetKey[] = ["high", "standard", "small"];

const PRESETS: Record<PresetKey, { bitrate: string; title: string; desc: string }> = {
  high:     { bitrate: "320k", title: "High",     desc: "320 kbps — MP3 ceiling, best for music" },
  standard: { bitrate: "192k", title: "Standard", desc: "192 kbps — solid all-rounder" },
  small:    { bitrate: "128k", title: "Small",    desc: "128 kbps — fine for speech, tiny file" },
};

type Status = "idle" | "running" | "done" | "error";

export function VideoToMp3Content() {
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<PresetKey>("high");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState<{ blob: Blob; filename: string; durationMs: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const isLarge = useMemo(() => !!file && file.size > SIZE_WARN_BYTES, [file]);

  const handleRun = async () => {
    if (!file) return;
    setStatus("running");
    setProgress(0);
    setOutput(null);
    setError(null);

    try {
      const outName = `${stripExt(file.name)}.mp3`;
      const result = await runFFmpeg({
        input: file,
        outputName: "output.mp3",
        args: ["-vn", "-c:a", "libmp3lame", "-b:a", PRESETS[preset].bitrate],
        onProgress: (p) => setProgress(Math.min(1, Math.max(0, p))),
      });
      setOutput({ blob: result.blob, filename: outName, durationMs: result.durationMs });
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setStatus("error");
    }
  };

  const isRunning = status === "running";

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Video to MP3 Converter</h1>
        <p className="mt-2 text-gray-600">
          Convert a video to MP3 in your browser. Pick a quality, download. Your file never leaves
          your device.
        </p>
      </header>

      <section className="space-y-5 rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <label className="mb-2 block text-sm font-medium">Input video</label>
          <FileInput accept="video/*,audio/*" onFileSelect={setFile} disabled={isRunning} />
        </div>

        {isLarge && (
          <FFHubCTA
            variant="warn"
            reason="Your file is over 500 MB — ffmpeg.wasm may be slow or crash in the browser. The cloud version has no upload limit."
          />
        )}

        <div>
          <label className="mb-2 block text-sm font-medium">Quality</label>
          <PresetCard
            options={PRESET_KEYS}
            active={preset}
            onSelect={setPreset}
            renderTitle={(k) => PRESETS[k].title}
            renderDesc={(k) => PRESETS[k].desc}
          />
        </div>

        <button
          type="button"
          onClick={handleRun}
          disabled={!file || isRunning}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-900 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isRunning && <Loader2 className="h-4 w-4 animate-spin" />}
          {isRunning ? `Converting… ${Math.round(progress * 100)}%` : "Convert to MP3"}
        </button>

        {!file && !isRunning && (
          <p className="text-center text-xs text-gray-500">
            First run downloads ~30 MB of ffmpeg.wasm core (one-time, cached).
          </p>
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
            {error}
          </div>
        )}

        {output && (
          <>
            <OutputCard {...output} />
            <FFHubCTA variant="success" />
          </>
        )}
      </section>

      <section className="mt-10">
        <FFHubCTA variant="info" />
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-semibold">FAQ</h2>
        <details className="rounded-lg border bg-white p-4">
          <summary className="cursor-pointer text-sm font-medium">Which bitrate should I pick?</summary>
          <p className="mt-2 text-sm text-gray-600">
            320 kbps for music you care about. 192 kbps is the music sweet spot — most people can&apos;t
            tell it apart from 320k. 128 kbps for podcasts, lectures, audiobooks where speech clarity
            matters more than fidelity.
          </p>
        </details>
        <details className="rounded-lg border bg-white p-4">
          <summary className="cursor-pointer text-sm font-medium">Does my video get uploaded?</summary>
          <p className="mt-2 text-sm text-gray-600">
            No. Everything runs in your browser via ffmpeg.wasm. The video never leaves your device,
            and this site has no server-side storage at all.
          </p>
        </details>
        <details className="rounded-lg border bg-white p-4">
          <summary className="cursor-pointer text-sm font-medium">What about YouTube videos?</summary>
          <p className="mt-2 text-sm text-gray-600">
            YouTube doesn&apos;t let you download videos directly. Use{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">yt-dlp</code> or another tool to
            grab the video file first, then drop it here.
          </p>
        </details>
        <details className="rounded-lg border bg-white p-4">
          <summary className="cursor-pointer text-sm font-medium">My file is huge — what now?</summary>
          <p className="mt-2 text-sm text-gray-600">
            Above ~500 MB the browser will struggle. Try the cloud version at{" "}
            <a
              href="https://www.ffhub.io?utm_source=ffmpeg-online-tools&utm_medium=referral&utm_campaign=video-to-mp3-faq"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              ffhub.io
            </a>{" "}
            — same FFmpeg, no upload limit, $1 ≈ 1,000 credits.
          </p>
        </details>
      </section>
    </div>
  );
}

function stripExt(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
}

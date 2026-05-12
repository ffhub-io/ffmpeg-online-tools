"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { FFHubCTA } from "@/components/ffhub-cta";
import { FileInput } from "@/components/file-input";
import { OutputCard } from "@/components/output-card";
import { PresetCard } from "@/components/preset-card";
import { runFFmpeg } from "@/lib/ffmpeg-runner";

type FormatKey = "mp4" | "webm" | "mkv" | "mov";
const FORMAT_KEYS: FormatKey[] = ["mp4", "webm", "mkv", "mov"];

interface Format {
  title: string;
  desc: string;
  // Prefer `codec copy` (a container-only remux). WebM is the exception — its
  // accepted video codecs (VP8/VP9/AV1) rarely match the source, so it re-encodes.
  args: string[];
}

// Container conversions. `copy` keeps the existing streams (instant, lossless);
// WebM needs an actual re-encode since most sources don't already use VP9.
const FORMATS: Record<FormatKey, Format> = {
  mp4: {
    title: "MP4",
    desc: "Universal, plays everywhere. H.264 + AAC.",
    args: ["-c", "copy", "-movflags", "+faststart"],
  },
  webm: {
    title: "WebM",
    desc: "Web-native, open. VP9 + Opus (re-encodes).",
    args: ["-c:v", "libvpx-vp9", "-b:v", "1M", "-c:a", "libopus"],
  },
  mkv: {
    title: "MKV",
    desc: "Container holds anything. Lossless copy.",
    args: ["-c", "copy"],
  },
  mov: {
    title: "MOV",
    desc: "Apple-flavored MP4. Lossless copy.",
    args: ["-c", "copy", "-movflags", "+faststart"],
  },
};

type Status = "idle" | "running" | "done" | "error";

export function ConvertContent() {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState<FormatKey>("mp4");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState<{ blob: Blob; filename: string; durationMs: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!file) return;
    setStatus("running");
    setProgress(0);
    setOutput(null);
    setError(null);

    try {
      const outName = `${stripExt(file.name)}.${target}`;
      const result = await runFFmpeg({
        input: file,
        outputName: `output.${target}`,
        args: FORMATS[target].args,
        onProgress: (n) => setProgress(Math.min(1, Math.max(0, n))),
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
        <h1 className="text-3xl font-semibold tracking-tight">Convert video format</h1>
        <p className="mt-2 text-gray-600">
          Change a video&apos;s container — MP4, WebM, MKV, or MOV. Lossless copy when codecs are
          compatible.
        </p>
      </header>

      <section className="space-y-5 rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <label className="mb-2 block text-sm font-medium">Input video</label>
          <FileInput accept="video/*" onFileSelect={setFile} disabled={isRunning} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Target format</label>
          <PresetCard
            options={FORMAT_KEYS}
            active={target}
            onSelect={setTarget}
            renderTitle={(k) => FORMATS[k].title}
            renderDesc={(k) => FORMATS[k].desc}
            columns="grid-cols-2 sm:grid-cols-4"
          />
        </div>

        <button
          type="button"
          onClick={handleRun}
          disabled={!file || isRunning}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-900 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isRunning && <Loader2 className="h-4 w-4 animate-spin" />}
          {isRunning ? `Converting… ${Math.round(progress * 100)}%` : `Convert to ${target.toUpperCase()}`}
        </button>

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
    </div>
  );
}

function stripExt(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
}

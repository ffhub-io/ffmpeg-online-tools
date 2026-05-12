"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { FFHubCTA } from "@/components/ffhub-cta";
import { FileInput } from "@/components/file-input";
import { OutputCard } from "@/components/output-card";
import { PresetCard } from "@/components/preset-card";
import { runFFmpeg } from "@/lib/ffmpeg-runner";

type PresetKey = "high" | "compatible" | "speech" | "lossless";
const PRESET_KEYS: PresetKey[] = ["high", "compatible", "speech", "lossless"];

interface Preset {
  title: string;
  desc: string;
  ext: string;
  args: string[];
}

const PRESETS: Record<PresetKey, Preset> = {
  high: {
    title: "High quality",
    desc: "MP3 320k — best MP3, plays everywhere",
    ext: "mp3",
    args: ["-vn", "-c:a", "libmp3lame", "-b:a", "320k", "-ar", "44100"],
  },
  compatible: {
    title: "Compatible",
    desc: "MP3 192k — smaller, universal",
    ext: "mp3",
    args: ["-vn", "-c:a", "libmp3lame", "-b:a", "192k", "-ar", "44100"],
  },
  speech: {
    title: "Speech / podcast",
    desc: "Opus 64k mono — tiny, voice-optimized",
    ext: "opus",
    args: ["-vn", "-c:a", "libopus", "-b:a", "64k", "-ar", "24000", "-ac", "1"],
  },
  lossless: {
    title: "Lossless",
    desc: "FLAC — bit-perfect, ~half of WAV",
    ext: "flac",
    args: ["-vn", "-c:a", "flac"],
  },
};

type Status = "idle" | "running" | "done" | "error";

export function ExtractAudioContent() {
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<PresetKey>("high");
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

    const p = PRESETS[preset];
    try {
      const outName = `${stripExt(file.name)}.${p.ext}`;
      const result = await runFFmpeg({
        input: file,
        outputName: `output.${p.ext}`,
        args: p.args,
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
        <h1 className="text-3xl font-semibold tracking-tight">Extract audio from video</h1>
        <p className="mt-2 text-gray-600">
          Strip the audio track out of any video and save it as MP3, Opus, or lossless FLAC. Runs
          fully in your browser.
        </p>
      </header>

      <section className="space-y-5 rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <label className="mb-2 block text-sm font-medium">Input video</label>
          <FileInput accept="video/*,audio/*" onFileSelect={setFile} disabled={isRunning} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Preset</label>
          <PresetCard
            options={PRESET_KEYS}
            active={preset}
            onSelect={setPreset}
            renderTitle={(k) => PRESETS[k].title}
            renderDesc={(k) => PRESETS[k].desc}
            columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          />
        </div>

        <button
          type="button"
          onClick={handleRun}
          disabled={!file || isRunning}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-900 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isRunning && <Loader2 className="h-4 w-4 animate-spin" />}
          {isRunning ? `Extracting… ${Math.round(progress * 100)}%` : "Extract audio"}
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

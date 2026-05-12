"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { FFHubCTA } from "@/components/ffhub-cta";
import { FileInput } from "@/components/file-input";
import { OutputCard } from "@/components/output-card";
import { PresetCard } from "@/components/preset-card";
import { runFFmpeg } from "@/lib/ffmpeg-runner";

type PresetKey = "high" | "balanced" | "small";
const PRESET_KEYS: PresetKey[] = ["high", "balanced", "small"];

interface Preset {
  title: string;
  desc: string;
  crf: number;
}

// The default wasm core ships libx264. We force preset=fast — slower presets
// (medium / slow) are too painful in a browser tab.
const PRESETS: Record<PresetKey, Preset> = {
  high:     { title: "High quality",   desc: "CRF 20 — minimal quality loss, larger",         crf: 20 },
  balanced: { title: "Balanced",       desc: "CRF 23 — recommended (default in FFmpeg)",      crf: 23 },
  small:    { title: "Smallest",       desc: "CRF 28 — visible artifacts but tiny file",      crf: 28 },
};

type Status = "idle" | "running" | "done" | "error";

export function CompressContent() {
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<PresetKey>("balanced");
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
      const outName = `${stripExt(file.name)}-compressed.mp4`;
      const result = await runFFmpeg({
        input: file,
        outputName: "output.mp4",
        args: [
          "-c:v", "libx264",
          "-preset", "fast",
          "-crf", String(PRESETS[preset].crf),
          "-c:a", "aac",
          "-b:a", "128k",
          "-movflags", "+faststart",
        ],
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
        <h1 className="text-3xl font-semibold tracking-tight">Compress video</h1>
        <p className="mt-2 text-gray-600">
          Shrink a video with H.264 right in your browser. Three quality presets — pick how much size
          you want to trade for sharpness.
        </p>
      </header>

      <section className="space-y-5 rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <label className="mb-2 block text-sm font-medium">Input video</label>
          <FileInput accept="video/*" onFileSelect={setFile} disabled={isRunning} />
        </div>

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
          {isRunning ? `Compressing… ${Math.round(progress * 100)}%` : "Compress"}
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

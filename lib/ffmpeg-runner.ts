"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// ffmpeg.wasm runs inside a Web Worker; one instance is enough since the
// worker serializes work internally. On first use load() pulls the ~30MB
// wasm core into a blob URL, which is then reused.
let instance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

// Pull the core from unpkg. We pipe it through toBlobURL to turn the
// cross-origin asset into a same-origin blob URL — COEP: require-corp
// would otherwise block it.
const CORE_VERSION = "0.12.10";
const CORE_BASE = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd`;

/** Lazily get the (singleton) ffmpeg instance. */
export async function getFFmpeg(onLog?: (msg: string) => void): Promise<FFmpeg> {
  if (instance) return instance;
  if (loadPromise) return loadPromise;

  const ff = new FFmpeg();
  if (onLog) ff.on("log", ({ message }) => onLog(message));

  loadPromise = (async () => {
    await ff.load({
      coreURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, "application/wasm"),
    });
    instance = ff;
    return ff;
  })();
  return loadPromise;
}

export interface RunOptions {
  /** Input file from any source; written into the ffmpeg.wasm virtual FS. */
  input: File | Blob;
  /** Output filename inside the virtual FS; referenced by the ffmpeg command. */
  outputName: string;
  /** ffmpeg args without the `ffmpeg` binary or `-i input` prefix (runner adds them). */
  args: string[];
  /** Progress callback (0-1). */
  onProgress?: (progress: number) => void;
  /** Log callback. */
  onLog?: (msg: string) => void;
}

export interface RunResult {
  /** Output blob. */
  blob: Blob;
  /** Output size in bytes. */
  size: number;
  /** Processing duration in milliseconds. */
  durationMs: number;
}

/**
 * Run an ffmpeg command.
 *
 * Flow:
 *   1. Write `input` into the virtual FS as `input.bin`
 *   2. Exec `ffmpeg -i input.bin <args> outputName`
 *   3. Read `outputName` back as a Blob
 *   4. Clean up the virtual FS so a later run doesn't see stale files
 */
export async function runFFmpeg(opts: RunOptions): Promise<RunResult> {
  const ff = await getFFmpeg(opts.onLog);

  // ffmpeg detects format from the file header, so a generic input name is fine.
  const inputName = "input.bin";
  await ff.writeFile(inputName, await fetchFile(opts.input));

  const t0 = performance.now();

  let unsub: (() => void) | undefined;
  if (opts.onProgress) {
    const handler = ({ progress }: { progress: number }) => opts.onProgress?.(progress);
    ff.on("progress", handler);
    unsub = () => ff.off("progress", handler);
  }

  try {
    await ff.exec(["-i", inputName, ...opts.args, opts.outputName]);
  } finally {
    unsub?.();
  }

  const data = (await ff.readFile(opts.outputName)) as Uint8Array;
  const durationMs = performance.now() - t0;

  // Cleanup — don't leave artifacts between runs on the shared instance.
  await ff.deleteFile(inputName);
  await ff.deleteFile(opts.outputName);

  const blob = new Blob([data as BlobPart], { type: mimeFromName(opts.outputName) });
  return { blob, size: blob.size, durationMs };
}

function mimeFromName(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return (
    {
      mp3: "audio/mpeg",
      aac: "audio/aac",
      m4a: "audio/mp4",
      wav: "audio/wav",
      flac: "audio/flac",
      opus: "audio/opus",
      ogg: "audio/ogg",
      mp4: "video/mp4",
      webm: "video/webm",
      mkv: "video/x-matroska",
      mov: "video/quicktime",
      gif: "image/gif",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
    }[ext] ?? "application/octet-stream"
  );
}

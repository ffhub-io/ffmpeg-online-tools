"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// ffmpeg.wasm 跑在 Web Worker 里，单实例足够（同时跑多个任务也共享同一个 worker）。
// 实例第一次创建时 load() 把 ~30MB 的 wasm core 下载到 blob URL，之后 reused。
let instance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

// 从 unpkg 拉 core。我们走 toBlobURL 把跨域 wasm 转成同源 blob URL，避免 COEP
// require-corp 把它拦下来。
const CORE_VERSION = "0.12.10";
const CORE_BASE = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd`;

/** 拿（懒加载的）ffmpeg 实例。多次调用共享同一实例。 */
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
  /** 输入文件（任意来源，会喂给 ffmpeg.wasm 虚拟 FS） */
  input: File | Blob;
  /** 输出文件名（在虚拟 FS 内的，ffmpeg 命令里也要引用这个） */
  outputName: string;
  /** ffmpeg 命令参数，不含 `ffmpeg`、不含 `-i input` 前缀（runner 自动加） */
  args: string[];
  /** 实时进度（0-1） */
  onProgress?: (progress: number) => void;
  /** 实时日志 */
  onLog?: (msg: string) => void;
}

export interface RunResult {
  /** 输出 blob */
  blob: Blob;
  /** 输出文件大小（字节） */
  size: number;
  /** 处理耗时（毫秒） */
  durationMs: number;
}

/**
 * 跑一条 ffmpeg 命令。
 *
 * 流程：
 *   1. 把 input 写到虚拟 FS 的 input.ext
 *   2. 执行 ffmpeg -i input.ext <args> outputName
 *   3. 读出 outputName 包成 Blob
 *   4. 清理虚拟 FS（避免下次跑同名文件残留旧数据）
 */
export async function runFFmpeg(opts: RunOptions): Promise<RunResult> {
  const ff = await getFFmpeg(opts.onLog);

  // 输入文件用通用名 + 用 mime 推断后缀；ffmpeg 通过文件头识别格式，
  // 后缀只是给虚拟 FS 用，不影响解码。
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

  // 清理 — 同实例多次 run 之间不要残留
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

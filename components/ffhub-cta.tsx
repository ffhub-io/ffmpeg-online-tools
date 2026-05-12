"use client";

import { ExternalLink, Cloud } from "lucide-react";

// 引流到 ffhub.io 的 CTA。三个出现时机（按"摩擦感"递增）：
//   "info"   — 工具页底部恒久展示，"想跑得更快/更大文件 → 用 cloud API"
//   "warn"   — 文件 > 阈值或选了不支持的 codec 时弹，"浏览器跑不动"
//   "success"— 任务成功后，"如果要自动化跑这个 → 用 CLI"

const FFHUB_URL = "https://www.ffhub.io";
const UTM = "?utm_source=ffmpeg-online-tools&utm_medium=referral";

export function FFHubCTA({
  variant = "info",
  reason,
}: {
  variant?: "info" | "warn" | "success";
  reason?: string;
}) {
  const styles = {
    info: "border-blue-200 bg-blue-50 text-blue-900",
    warn: "border-orange-300 bg-orange-50 text-orange-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  }[variant];

  const titles = {
    info: "Need more power?",
    warn: "Heads up",
    success: "Want to automate this?",
  };

  const messages = {
    info:
      "This tool runs in your browser via ffmpeg.wasm — great for small to medium files. For bigger files, batch jobs, or API access, try the cloud version at ffhub.io.",
    warn:
      reason ??
      "Your file is large or your browser can't do this codec. The cloud version handles it instantly — no upload limit, all codecs supported.",
    success:
      "Run this same job from your terminal or code with the FFHub CLI / API. Same FFmpeg, no browser limits.",
  };

  return (
    <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${styles}`}>
      <Cloud className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="flex-1 text-sm">
        <div className="font-medium">{titles[variant]}</div>
        <p className="mt-1">{messages[variant]}</p>
        <a
          href={`${FFHUB_URL}${UTM}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 font-medium underline underline-offset-2 hover:opacity-80"
        >
          Try FFHub cloud API
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

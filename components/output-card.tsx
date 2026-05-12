"use client";

import { Download } from "lucide-react";
import { useEffect, useRef } from "react";

import { formatBytes } from "@/lib/utils";

export function OutputCard({
  blob,
  filename,
  durationMs,
}: {
  blob: Blob;
  filename: string;
  durationMs: number;
}) {
  const urlRef = useRef<string>("");

  // Blob URLs leak memory until revoked; release on unmount.
  useEffect(() => {
    urlRef.current = URL.createObjectURL(blob);
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, [blob]);

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-emerald-900">{filename}</div>
          <div className="mt-1 text-xs text-emerald-700">
            {formatBytes(blob.size)} · processed in {(durationMs / 1000).toFixed(1)}s
          </div>
        </div>
        <a
          href={urlRef.current}
          download={filename}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Download className="h-4 w-4" />
          Download
        </a>
      </div>
    </div>
  );
}

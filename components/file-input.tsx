"use client";

import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";

import { cn, formatBytes } from "@/lib/utils";

// Hard cap on the input size. Above this ffmpeg.wasm reliably pegs the
// CPU at 100% and OOMs the tab — so we reject the file outright instead
// of letting the user kick off a doomed run.
export const DEFAULT_MAX_BYTES = 500 * 1024 * 1024;

export function FileInput({
  accept = "video/*,audio/*",
  maxBytes = DEFAULT_MAX_BYTES,
  onFileSelect,
  disabled = false,
}: {
  accept?: string;
  maxBytes?: number;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const setOrReject = (f: File | null) => {
    if (f && f.size > maxBytes) {
      setError(
        `File is ${formatBytes(f.size)}. This tool runs in your browser and only handles files up to ${formatBytes(maxBytes)} — bigger ones freeze the tab.`,
      );
      setFile(null);
      onFileSelect(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setError(null);
    setFile(f);
    onFileSelect(f);
  };

  const clear = () => {
    setOrReject(null);
  };

  if (file) {
    return (
      <div className="flex items-center justify-between rounded-lg border bg-white px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{file.name}</div>
          <div className="text-xs text-gray-500">{formatBytes(file.size)}</div>
        </div>
        <button
          type="button"
          onClick={clear}
          disabled={disabled}
          className="ml-3 rounded p-1 hover:bg-gray-100 disabled:opacity-50"
          aria-label="Remove file"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 transition-colors",
          dragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50",
          disabled && "pointer-events-none opacity-50",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) setOrReject(f);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          disabled={disabled}
          onChange={(e) => setOrReject(e.target.files?.[0] ?? null)}
        />
        <Upload className="h-6 w-6 text-gray-400" />
        <div className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">Click to upload</span> or drag and drop
        </div>
        <div className="text-xs text-gray-500">
          Stays in your browser — never leaves your device. Up to {formatBytes(maxBytes)}.
        </div>
      </label>
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
          {error}
        </div>
      )}
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";

export function PresetCard<K extends string>({
  options,
  active,
  onSelect,
  renderTitle,
  renderDesc,
  columns = "grid-cols-1 sm:grid-cols-3",
}: {
  options: readonly K[];
  active: K | null;
  onSelect: (key: K) => void;
  renderTitle: (key: K) => string;
  renderDesc: (key: K) => string;
  columns?: string;
}) {
  return (
    <div className={cn("grid gap-2", columns)}>
      {options.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onSelect(key)}
          className={cn(
            "rounded-lg border px-3 py-3 text-left transition-colors",
            active === key
              ? "border-gray-900 bg-gray-100"
              : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50",
          )}
        >
          <div className="text-sm font-medium">{renderTitle(key)}</div>
          <div className="mt-1 text-xs text-gray-500">{renderDesc(key)}</div>
        </button>
      ))}
    </div>
  );
}

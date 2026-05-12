"use client";

import { cn } from "@/lib/utils";

export function ChipRow<T extends string>({
  options,
  value,
  onChange,
  renderLabel,
  className,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  renderLabel: (v: T) => string;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-2 sm:grid-cols-3", className)}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-md border px-3 py-2 text-sm transition-colors",
            value === opt
              ? "border-gray-900 bg-gray-100 font-medium"
              : "border-gray-300 bg-white hover:border-gray-400",
          )}
        >
          {renderLabel(opt)}
        </button>
      ))}
    </div>
  );
}

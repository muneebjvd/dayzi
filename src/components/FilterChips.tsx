"use client";

interface FilterChipsProps {
  filters: string[];
  active: string;
  onChange: (f: string) => void;
  counts?: Record<string, number>;
}

export default function FilterChips({
  filters,
  active,
  onChange,
  counts,
}: FilterChipsProps) {
  return (
    <div
      role="group"
      aria-label="Filter products"
      className="flex gap-2 overflow-x-auto pb-4 pt-2 px-4 scrollbar-hide"
    >
      {filters.map((f) => {
        const isActive = f === active;
        const count = counts?.[f];
        return (
          <button
            key={f}
            id={`filter-${f.toLowerCase().replace(/\s+/g, "-").replace(/[&]/g, "and")}`}
            onClick={() => onChange(f)}
            aria-pressed={isActive}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all btn-tap whitespace-nowrap ${
              isActive
                ? "bg-[#ec4899] text-white shadow-md"
                : "bg-white text-neutral-600 hover:bg-pink-50 hover:text-pink-600 border border-pink-100"
            }`}
          >
            {f}
            {count !== undefined && (
              <span
                className={`ml-1.5 text-xs font-semibold ${isActive ? "opacity-80" : "text-pink-400"}`}
              >
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

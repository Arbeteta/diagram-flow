export interface ColorRow {
  name: string;
  shades: { label: string; value: string }[];
}

export const TAILWIND_COLORS: ColorRow[] = [
  {
    name: "Slate",
    shades: [
      { label: "400", value: "#94a3b8" },
      { label: "500", value: "#64748b" },
      { label: "600", value: "#475569" },
      { label: "700", value: "#334155" },
      { label: "800", value: "#1e293b" },
      { label: "900", value: "#0f172a" },
    ],
  },
  {
    name: "Gray",
    shades: [
      { label: "400", value: "#9ca3af" },
      { label: "500", value: "#6b7280" },
      { label: "600", value: "#4b5563" },
      { label: "700", value: "#374151" },
      { label: "800", value: "#1f2937" },
      { label: "900", value: "#111827" },
    ],
  },
  {
    name: "Zinc",
    shades: [
      { label: "400", value: "#a1a1aa" },
      { label: "500", value: "#71717a" },
      { label: "600", value: "#52525b" },
      { label: "700", value: "#3f3f46" },
      { label: "800", value: "#27272a" },
      { label: "900", value: "#18181b" },
    ],
  },
  {
    name: "Red",
    shades: [
      { label: "400", value: "#f87171" },
      { label: "500", value: "#ef4444" },
      { label: "600", value: "#dc2626" },
      { label: "700", value: "#b91c1c" },
      { label: "800", value: "#991b1b" },
      { label: "900", value: "#7f1d1d" },
    ],
  },
  {
    name: "Orange",
    shades: [
      { label: "400", value: "#fb923c" },
      { label: "500", value: "#f97316" },
      { label: "600", value: "#ea580c" },
      { label: "700", value: "#c2410c" },
      { label: "800", value: "#9a3412" },
      { label: "900", value: "#7c2d12" },
    ],
  },
  {
    name: "Amber",
    shades: [
      { label: "400", value: "#fbbf24" },
      { label: "500", value: "#f59e0b" },
      { label: "600", value: "#d97706" },
      { label: "700", value: "#b45309" },
      { label: "800", value: "#92400e" },
      { label: "900", value: "#78350f" },
    ],
  },
  {
    name: "Yellow",
    shades: [
      { label: "400", value: "#facc15" },
      { label: "500", value: "#eab308" },
      { label: "600", value: "#ca8a04" },
      { label: "700", value: "#a16207" },
      { label: "800", value: "#854d0e" },
      { label: "900", value: "#713f12" },
    ],
  },
  {
    name: "Lime",
    shades: [
      { label: "400", value: "#a3e635" },
      { label: "500", value: "#84cc16" },
      { label: "600", value: "#65a30d" },
      { label: "700", value: "#4d7c0f" },
      { label: "800", value: "#3f6212" },
      { label: "900", value: "#365314" },
    ],
  },
  {
    name: "Green",
    shades: [
      { label: "400", value: "#4ade80" },
      { label: "500", value: "#22c55e" },
      { label: "600", value: "#16a34a" },
      { label: "700", value: "#15803d" },
      { label: "800", value: "#166534" },
      { label: "900", value: "#14532d" },
    ],
  },
  {
    name: "Emerald",
    shades: [
      { label: "400", value: "#34d399" },
      { label: "500", value: "#10b981" },
      { label: "600", value: "#059669" },
      { label: "700", value: "#047857" },
      { label: "800", value: "#065f46" },
      { label: "900", value: "#064e3b" },
    ],
  },
  {
    name: "Teal",
    shades: [
      { label: "400", value: "#2dd4bf" },
      { label: "500", value: "#14b8a6" },
      { label: "600", value: "#0d9488" },
      { label: "700", value: "#0f766e" },
      { label: "800", value: "#115e59" },
      { label: "900", value: "#134e4a" },
    ],
  },
  {
    name: "Cyan",
    shades: [
      { label: "400", value: "#22d3ee" },
      { label: "500", value: "#06b6d4" },
      { label: "600", value: "#0891b2" },
      { label: "700", value: "#0e7490" },
      { label: "800", value: "#155e75" },
      { label: "900", value: "#164e63" },
    ],
  },
  {
    name: "Sky",
    shades: [
      { label: "400", value: "#38bdf8" },
      { label: "500", value: "#0ea5e9" },
      { label: "600", value: "#0284c7" },
      { label: "700", value: "#0369a1" },
      { label: "800", value: "#075985" },
      { label: "900", value: "#0c4a6e" },
    ],
  },
  {
    name: "Blue",
    shades: [
      { label: "400", value: "#60a5fa" },
      { label: "500", value: "#3b82f6" },
      { label: "600", value: "#2563eb" },
      { label: "700", value: "#1d4ed8" },
      { label: "800", value: "#1e40af" },
      { label: "900", value: "#1e3a8a" },
    ],
  },
  {
    name: "Indigo",
    shades: [
      { label: "400", value: "#818cf8" },
      { label: "500", value: "#6366f1" },
      { label: "600", value: "#4f46e5" },
      { label: "700", value: "#4338ca" },
      { label: "800", value: "#3730a3" },
      { label: "900", value: "#312e81" },
    ],
  },
  {
    name: "Violet",
    shades: [
      { label: "400", value: "#a78bfa" },
      { label: "500", value: "#8b5cf6" },
      { label: "600", value: "#7c3aed" },
      { label: "700", value: "#6d28d9" },
      { label: "800", value: "#5b21b6" },
      { label: "900", value: "#4c1d95" },
    ],
  },
  {
    name: "Purple",
    shades: [
      { label: "400", value: "#c084fc" },
      { label: "500", value: "#a855f7" },
      { label: "600", value: "#9333ea" },
      { label: "700", value: "#7e22ce" },
      { label: "800", value: "#6b21a8" },
      { label: "900", value: "#581c87" },
    ],
  },
  {
    name: "Fuchsia",
    shades: [
      { label: "400", value: "#e879f9" },
      { label: "500", value: "#d946ef" },
      { label: "600", value: "#c026d3" },
      { label: "700", value: "#a21caf" },
      { label: "800", value: "#86198f" },
      { label: "900", value: "#701a75" },
    ],
  },
  {
    name: "Pink",
    shades: [
      { label: "400", value: "#f472b6" },
      { label: "500", value: "#ec4899" },
      { label: "600", value: "#db2777" },
      { label: "700", value: "#be185d" },
      { label: "800", value: "#9d174d" },
      { label: "900", value: "#831843" },
    ],
  },
  {
    name: "Rose",
    shades: [
      { label: "400", value: "#fb7185" },
      { label: "500", value: "#f43f5e" },
      { label: "600", value: "#e11d48" },
      { label: "700", value: "#be123c" },
      { label: "800", value: "#9f1239" },
      { label: "900", value: "#881337" },
    ],
  },
];

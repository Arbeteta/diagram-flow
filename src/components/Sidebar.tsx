import { useCallback, type DragEvent } from "react";
import { NODE_TYPE_DEFINITIONS, COLOR_PALETTES } from "../utils/defaults";
import { useDiagramStore } from "../store/diagramStore";
import { ColorPicker } from "./ColorPicker";
import { ICONS } from "../utils/icons";

export function Sidebar() {
  const activePalette = useDiagramStore((s) => s.activePalette);
  const setPalette = useDiagramStore((s) => s.setPalette);
  const globalArrowColor = useDiagramStore((s) => s.globalArrowColor);
  const setGlobalArrowColor = useDiagramStore((s) => s.setGlobalArrowColor);
  const customPalette = useDiagramStore((s) => s.customPalette);
  const setCustomPaletteColor = useDiagramStore((s) => s.setCustomPaletteColor);

  const onDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>, nodeType: string) => {
      event.dataTransfer.setData("application/reactflow", nodeType);
      event.dataTransfer.effectAllowed = "move";
    },
    []
  );

  return (
    <aside className="w-48 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-y-auto shrink-0">
      <div className="p-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Nodes
        </h2>
      </div>
      <div className="flex flex-col gap-1 p-2">
        {NODE_TYPE_DEFINITIONS.map((def) => (
          <div
            key={def.type}
            draggable
            onDragStart={(e) => onDragStart(e, def.type)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing
              bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600
              hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md
              transition-all duration-150 select-none"
          >
            <span className="w-6 h-6 shrink-0 flex items-center justify-center">
              {ICONS[def.type]?.(def.defaultColor) ?? def.icon}
            </span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">
              {def.label}
            </span>
          </div>
        ))}
      </div>

      {/* Color palette selector */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="p-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Palette
          </h2>
          <div className="flex flex-col gap-1">
            {COLOR_PALETTES.map((palette) => (
              <button
                key={palette.id}
                onClick={() => setPalette(palette.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-150
                  ${activePalette === palette.id
                    ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700"
                    : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
              >
                <span
                  className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 shrink-0"
                  style={{ background: palette.headerColor }}
                />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">
                  {palette.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom palette editor */}
      {activePalette === "custom" && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="p-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Edit Palette
            </h2>
            <div className="flex flex-col gap-1.5">
              {([
                ["headerColor", "Header"],
                ["bodyColor", "Body"],
                ["edgeColor", "Edge"],
                ["borderColor", "Border"],
                ["textColor", "Text"],
                ["descriptionColor", "Desc Text"],
                ["booleanHeaderColor", "AND/OR"],
              ] as [keyof typeof customPalette, string][]).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <div className="w-6 h-6">
                    <ColorPicker
                      circle
                      value={customPalette[key] as string}
                      onChange={(v) => setCustomPaletteColor(key, v)}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Arrow color selector */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="p-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Arrows
          </h2>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-150">
            <div className="w-5 h-5 shrink-0">
              <ColorPicker
                circle
                value={globalArrowColor}
                onChange={(v) => setGlobalArrowColor(v)}
              />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate font-mono">
              {globalArrowColor}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto p-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Drag items onto the canvas
        </p>
      </div>
    </aside>
  );
}

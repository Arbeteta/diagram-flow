import { useState, useRef, useEffect, useCallback } from "react";
import { TAILWIND_COLORS } from "../utils/colors";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  circle?: boolean;
}

export function ColorPicker({ value, onChange, circle }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleOpen = useCallback(() => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const popoverH = 320;
      let top = rect.bottom + 4;
      if (top + popoverH > window.innerHeight) {
        top = rect.top - popoverH - 4;
      }
      let left = rect.left;
      if (left + 288 > window.innerWidth) {
        left = window.innerWidth - 288 - 8;
      }
      if (left < 8) left = 8;
      setPos({ top, left });
    }
    setOpen(!open);
  }, [open]);

  const handlePick = useCallback(
    (color: string) => {
      onChange(color);
      setOpen(false);
    },
    [onChange]
  );

  return (
    <div ref={ref} className="w-full h-full">
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className={`w-full h-full border border-gray-300 dark:border-gray-600 cursor-pointer flex items-center justify-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors ${
          circle ? "rounded-full" : "rounded min-h-[28px]"
        }`}
        style={{ background: value }}
      />

      {open && (
        <div
          className="fixed z-[100] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-3 w-72 max-h-80 overflow-y-auto"
          style={{ top: pos.top, left: pos.left }}
        >
          {TAILWIND_COLORS.map((row) => (
            <div key={row.name} className="mb-2 last:mb-0">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1 block">
                {row.name}
              </span>
              <div className="flex gap-1">
                {row.shades.map((shade) => (
                  <button
                    key={shade.value}
                    type="button"
                    onClick={() => handlePick(shade.value)}
                    title={`${row.name} ${shade.label}`}
                    className="flex-1 h-6 rounded-full cursor-pointer hover:scale-110 hover:shadow-md transition-transform"
                    style={{ background: shade.value }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import type { DiagramNode, DiagramEdge } from "../types";

const STORAGE_KEY = "diagram-editor-state";
const THEME_KEY = "diagram-editor-theme";
const GRID_KEY = "diagram-editor-grid";
const PALETTE_KEY = "diagram-editor-palette";
const ALIGN_KEY = "diagram-editor-align";
const ARROW_COLOR_KEY = "diagram-editor-arrow-color";
const CUSTOM_PALETTE_KEY = "diagram-editor-custom-palette";

interface SavedState {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  viewport: { x: number; y: number; zoom: number } | null;
}

export function saveToLocalStorage(state: SavedState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function loadFromLocalStorage(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedState;
  } catch {
    return null;
  }
}

export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}

export function saveThemePreference(dark: boolean): void {
  try {
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  } catch {
    // Silently fail
  }
}

export function loadThemePreference(): boolean | null {
  try {
    const val = localStorage.getItem(THEME_KEY);
    if (val === "dark") return true;
    if (val === "light") return false;
    return null;
  } catch {
    return null;
  }
}

export function saveGridPreference(show: boolean): void {
  try {
    localStorage.setItem(GRID_KEY, show ? "show" : "hide");
  } catch {
    // Silently fail
  }
}

export function loadGridPreference(): boolean | null {
  try {
    const val = localStorage.getItem(GRID_KEY);
    if (val === "show") return true;
    if (val === "hide") return false;
    return null;
  } catch {
    return null;
  }
}

export function savePalettePreference(paletteId: string): void {
  try {
    localStorage.setItem(PALETTE_KEY, paletteId);
  } catch {
    // Silently fail
  }
}

export function loadPalettePreference(): string | null {
  try {
    return localStorage.getItem(PALETTE_KEY);
  } catch {
    return null;
  }
}

export function saveAlignPreference(left: boolean): void {
  try {
    localStorage.setItem(ALIGN_KEY, left ? "left" : "center");
  } catch {
    // Silently fail
  }
}

export function loadAlignPreference(): boolean | null {
  try {
    const val = localStorage.getItem(ALIGN_KEY);
    if (val === "left") return true;
    if (val === "center") return false;
    return null;
  } catch {
    return null;
  }
}

export function saveArrowColorPreference(color: string): void {
  try {
    localStorage.setItem(ARROW_COLOR_KEY, color);
  } catch {
    // Silently fail
  }
}

export function loadArrowColorPreference(): string | null {
  try {
    return localStorage.getItem(ARROW_COLOR_KEY);
  } catch {
    return null;
  }
}

export function saveCustomPalette(palette: Record<string, string>): void {
  try {
    localStorage.setItem(CUSTOM_PALETTE_KEY, JSON.stringify(palette));
  } catch {
    // Silently fail
  }
}

export function loadCustomPalette(): Record<string, string> | null {
  try {
    const raw = localStorage.getItem(CUSTOM_PALETTE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

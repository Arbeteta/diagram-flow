import { useEffect } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { DiagramEditor } from "./components/DiagramEditor";
import { Toolbar } from "./components/Toolbar";
import { Sidebar } from "./components/Sidebar";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { useDiagramStore } from "./store/diagramStore";
import { loadThemePreference, saveThemePreference, loadGridPreference, saveGridPreference, loadPalettePreference, savePalettePreference, loadAlignPreference, saveAlignPreference, loadArrowColorPreference, saveArrowColorPreference, loadCustomPalette, saveCustomPalette } from "./utils/localStorage";
import { saveToLocalStorage } from "./utils/localStorage";

export function App() {
  const darkMode = useDiagramStore((s) => s.darkMode);
  const setDarkMode = useDiagramStore((s) => s.setDarkMode);
  const showGrid = useDiagramStore((s) => s.showGrid);
  const setShowGrid = useDiagramStore((s) => s.setShowGrid);
  const activePalette = useDiagramStore((s) => s.activePalette);
  const setPalette = useDiagramStore((s) => s.setPalette);
  const textAlignLeft = useDiagramStore((s) => s.textAlignLeft);
  const setTextAlignLeft = useDiagramStore((s) => s.setTextAlignLeft);
  const globalArrowColor = useDiagramStore((s) => s.globalArrowColor);
  const setGlobalArrowColor = useDiagramStore((s) => s.setGlobalArrowColor);
  const customPalette = useDiagramStore((s) => s.customPalette);
  const setCustomPaletteColor = useDiagramStore((s) => s.setCustomPaletteColor);
  const nodes = useDiagramStore((s) => s.nodes);
  const edges = useDiagramStore((s) => s.edges);

  // Initialize preferences from localStorage
  useEffect(() => {
    const savedTheme = loadThemePreference();
    if (savedTheme !== null) {
      setDarkMode(savedTheme);
    }
    const savedGrid = loadGridPreference();
    if (savedGrid !== null) {
      setShowGrid(savedGrid);
    }
    const savedPalette = loadPalettePreference();
    if (savedPalette !== null) {
      setPalette(savedPalette);
    }
    const savedAlign = loadAlignPreference();
    if (savedAlign !== null) {
      setTextAlignLeft(savedAlign);
    }
    const savedArrow = loadArrowColorPreference();
    if (savedArrow !== null) {
      setGlobalArrowColor(savedArrow);
    }
    const savedCustom = loadCustomPalette();
    if (savedCustom !== null) {
      Object.entries(savedCustom).forEach(([key, value]) => {
        setCustomPaletteColor(key as keyof typeof savedCustom, value as string);
      });
    }
  }, [setDarkMode, setShowGrid, setPalette, setTextAlignLeft, setGlobalArrowColor, setCustomPaletteColor]);

  // Persist preferences
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    saveThemePreference(darkMode);
  }, [darkMode]);

  useEffect(() => {
    saveGridPreference(showGrid);
  }, [showGrid]);

  useEffect(() => {
    savePalettePreference(activePalette);
  }, [activePalette]);

  useEffect(() => {
    saveAlignPreference(textAlignLeft);
  }, [textAlignLeft]);

  useEffect(() => {
    saveArrowColorPreference(globalArrowColor);
  }, [globalArrowColor]);

  useEffect(() => {
    saveCustomPalette(customPalette as unknown as Record<string, string>);
  }, [customPalette]);

  // Auto-save to localStorage on changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage({ nodes, edges, viewport: null });
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [nodes, edges]);

  return (
    <div className="h-screen w-screen flex flex-col bg-white dark:bg-[#141414] text-gray-900 dark:text-gray-100 overflow-hidden">
      <ReactFlowProvider>
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <DiagramEditor />
          <PropertiesPanel />
        </div>
      </ReactFlowProvider>
    </div>
  );
}

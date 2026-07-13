import { useCallback, useState, useRef, useEffect } from "react";
import {
  Undo2,
  Redo2,
  Plus,
  Trash2,
  Maximize2,
  Download,
  Upload,
  Save,
  Moon,
  Sun,
  Eraser,
  Grid3X3,
  AlignLeft,
  AlignCenter,
  Image,
} from "lucide-react";
import { toPng } from "html-to-image";
import { useDiagramStore } from "../store/diagramStore";
import { NODE_TYPE_DEFINITIONS } from "../utils/defaults";
import { useReactFlow } from "@xyflow/react";
import { ICONS } from "../utils/icons";

export function Toolbar() {
  const undo = useDiagramStore((s) => s.undo);
  const redo = useDiagramStore((s) => s.redo);
  const past = useDiagramStore((s) => s.past);
  const future = useDiagramStore((s) => s.future);
  const addNode = useDiagramStore((s) => s.addNode);
  const deleteSelected = useDiagramStore((s) => s.deleteSelected);
  const selectedNodeId = useDiagramStore((s) => s.selectedNodeId);
  const selectedEdgeId = useDiagramStore((s) => s.selectedEdgeId);
  const resetCanvas = useDiagramStore((s) => s.resetCanvas);
  const darkMode = useDiagramStore((s) => s.darkMode);
  const toggleDarkMode = useDiagramStore((s) => s.toggleDarkMode);
  const showGrid = useDiagramStore((s) => s.showGrid);
  const toggleGrid = useDiagramStore((s) => s.toggleGrid);
  const textAlignLeft = useDiagramStore((s) => s.textAlignLeft);
  const toggleTextAlign = useDiagramStore((s) => s.toggleTextAlign);
  const setToast = useDiagramStore((s) => s.setToast);
  const exportDiagram = useDiagramStore((s) => s.exportDiagram);
  const importDiagram = useDiagramStore((s) => s.importDiagram);
  const nodes = useDiagramStore((s) => s.nodes);

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [importExportTab, setImportExportTab] = useState<"export" | "import">("export");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const reactFlow = useReactFlow();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddNode = useCallback(
    (nodeType: string) => {
      const viewport = reactFlow.getViewport();
      const position = reactFlow.screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
      addNode(nodeType, position);
      setShowAddMenu(false);
      setToast(`Added ${nodeType} node`);
    },
    [addNode, reactFlow, setToast]
  );

  const handleFitView = useCallback(() => {
    reactFlow.fitView({ padding: 0.2, duration: 300 });
  }, [reactFlow]);

  const handleExport = useCallback(() => {
    setImportExportTab("export");
    setShowImportExport(true);
  }, []);

  const handleImport = useCallback(() => {
    setImportExportTab("import");
    setShowImportExport(true);
  }, []);

  const handleCopyJson = useCallback(() => {
    const json = exportDiagram();
    navigator.clipboard.writeText(json).then(() => {
      setToast("Copied to clipboard");
    });
  }, [exportDiagram, setToast]);

  const handleDownload = useCallback(() => {
    const json = exportDiagram();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    a.download = `diagram-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("Diagram saved");
  }, [exportDiagram, setToast]);

  const handleImportJson = useCallback(() => {
    const textarea = document.getElementById("import-textarea") as HTMLTextAreaElement;
    if (textarea) {
      importDiagram(textarea.value);
      setShowImportExport(false);
    }
  }, [importDiagram]);

  const handleClear = useCallback(() => {
    resetCanvas();
    setShowClearConfirm(false);
  }, [resetCanvas]);

  const handleDelete = useCallback(() => {
    if (selectedNodeId || selectedEdgeId) {
      deleteSelected();
    }
  }, [selectedNodeId, selectedEdgeId, deleteSelected]);

  const handleExportPng = useCallback(() => {
    const viewport = document.querySelector(".react-flow__viewport") as HTMLElement;
    if (!viewport) return;
    toPng(viewport, {
      backgroundColor: darkMode ? "#030712" : "#ffffff",
      pixelRatio: 2,
    }).then((dataUrl) => {
      const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      const link = document.createElement("a");
      link.download = `diagram-${stamp}.png`;
      link.href = dataUrl;
      link.click();
      setToast("PNG exported");
    }).catch(() => {
      setToast("PNG export failed");
    });
  }, [darkMode, setToast]);

  return (
    <>
      <header className="h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center gap-1 px-2 shrink-0 z-10">
        {/* Left: Logo */}
        <img
          src="/orion-logo-white.svg"
          alt="Orion"
          className="h-4 mr-2 hidden dark:sm:inline"
        />
        <img
          src="/orion-logo-white.svg"
          alt="Orion"
          className="h-4 mr-2 hidden sm:inline dark:hidden"
          style={{ filter: "invert(1) brightness(0)" }}
        />
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mr-1 hidden sm:block" />

        {/* Undo / Redo */}
        <button
          onClick={undo}
          disabled={past.length === 0}
          title="Undo (Ctrl+Z)"
          className="toolbar-btn"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={redo}
          disabled={future.length === 0}
          title="Redo (Ctrl+Shift+Z)"
          className="toolbar-btn"
        >
          <Redo2 size={18} />
        </button>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Add Node */}
        <div ref={addMenuRef} className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            title="Add Node"
            className="toolbar-btn"
          >
            <Plus size={18} />
            <span className="ml-1 text-xs hidden sm:inline">Add</span>
          </button>
          {showAddMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 min-w-40 z-50">
              {NODE_TYPE_DEFINITIONS.map((def) => (
                <button
                  key={def.type}
                  onClick={() => handleAddNode(def.type)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="w-6 h-6 flex items-center justify-center">
                    {ICONS[def.type]?.(def.defaultColor) ?? def.icon}
                  </span>
                  {def.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={!selectedNodeId && !selectedEdgeId}
          title="Delete Selected (Delete)"
          className="toolbar-btn"
        >
          <Trash2 size={18} />
        </button>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Fit View */}
        <button
          onClick={handleFitView}
          title="Fit View"
          className="toolbar-btn"
        >
          <Maximize2 size={18} />
        </button>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Save */}
        <button onClick={handleDownload} title="Save (Ctrl+S)" className="toolbar-btn">
          <Save size={18} />
          <span className="ml-1 text-xs hidden sm:inline">Save</span>
        </button>

        {/* Export */}
        <button onClick={handleExport} title="Export JSON" className="toolbar-btn">
          <Download size={18} />
          <span className="ml-1 text-xs hidden sm:inline">Export</span>
        </button>

        {/* Import */}
        <button onClick={handleImport} title="Import JSON" className="toolbar-btn">
          <Upload size={18} />
          <span className="ml-1 text-xs hidden sm:inline">Import</span>
        </button>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Clear */}
        <button
          onClick={() => setShowClearConfirm(true)}
          disabled={nodes.length === 0}
          title="Clear Canvas"
          className="toolbar-btn"
        >
          <Eraser size={18} />
        </button>

        <div className="flex-1" />

        {/* Grid Toggle */}
        <button
          onClick={toggleGrid}
          title={showGrid ? "Hide Grid" : "Show Grid"}
          className={`toolbar-btn ${showGrid ? "text-blue-600 dark:text-blue-400" : ""}`}
        >
          <Grid3X3 size={18} />
        </button>

        {/* PNG Export */}
        <button onClick={handleExportPng} title="Export PNG" className="toolbar-btn">
          <Image size={18} />
        </button>

        {/* Text Align */}
        <button
          onClick={toggleTextAlign}
          title={textAlignLeft ? "Align Center" : "Align Left"}
          className="toolbar-btn"
        >
          {textAlignLeft ? <AlignLeft size={18} /> : <AlignCenter size={18} />}
        </button>

        {/* Dark Mode */}
        <button
          onClick={toggleDarkMode}
          title="Toggle Theme"
          className="toolbar-btn"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      {/* Import/Export Modal */}
      {showImportExport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setImportExportTab("export")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  importExportTab === "export"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Export
              </button>
              <button
                onClick={() => setImportExportTab("import")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  importExportTab === "import"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Import
              </button>
            </div>
            <div className="p-4">
              {importExportTab === "export" ? (
                <>
                  <textarea
                    readOnly
                    value={exportDiagram()}
                    className="w-full h-48 p-3 text-xs font-mono bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg resize-none text-gray-800 dark:text-gray-200 focus:outline-none"
                  />
                  <div className="flex gap-2 mt-3">
                    <button onClick={handleCopyJson} className="btn-primary flex-1">
                      Copy to Clipboard
                    </button>
                    <button onClick={handleDownload} className="btn-secondary flex-1">
                      Download .json
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <textarea
                    id="import-textarea"
                    placeholder="Paste JSON here..."
                    className="w-full h-48 p-3 text-xs font-mono bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg resize-none text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex gap-2 mt-3">
                    <button onClick={handleImportJson} className="btn-primary flex-1">
                      Load Diagram
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end px-4 pb-4">
              <button
                onClick={() => setShowImportExport(false)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Clear Canvas
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to clear all nodes and edges? This action can be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleClear} className="btn-danger">
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { create } from "zustand";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type XYPosition,
} from "@xyflow/react";
import type { DiagramNode, DiagramEdge, NodeData, EdgeData, HistorySnapshot, ColorPalette } from "../types";
import {
  createDefaultNodeData,
  createDefaultEdgeData,
  getPalette,
  COLOR_PALETTES,
  DEFAULT_SAMPLE_NODES,
  DEFAULT_SAMPLE_EDGES,
  DEFAULT_PALETTE_ID,
} from "../utils/defaults";
import { generateNodeId, generateEdgeId } from "../utils/idGenerator";
import { saveToLocalStorage, loadFromLocalStorage } from "../utils/localStorage";

const MAX_HISTORY = 50;

interface ClipboardData {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

interface DiagramState {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  past: HistorySnapshot[];
  future: HistorySnapshot[];
  clipboard: ClipboardData | null;
  toast: string | null;
  darkMode: boolean;
  showGrid: boolean;
  activePalette: string;
  textAlignLeft: boolean;
  globalArrowColor: string;
  customPalette: ColorPalette;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (type: string, position: XYPosition) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  updateEdgeData: (edgeId: string, data: Partial<EdgeData>) => void;
  deleteSelected: () => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  selectEdge: (edgeId: string | null) => void;
  clearSelection: () => void;
  undo: () => void;
  redo: () => void;
  importDiagram: (json: string) => boolean;
  exportDiagram: () => string;
  resetCanvas: () => void;
  pushHistory: () => void;
  setToast: (message: string | null) => void;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
  toggleGrid: () => void;
  setShowGrid: (show: boolean) => void;
  setPalette: (paletteId: string) => void;
  toggleTextAlign: () => void;
  setTextAlignLeft: (align: boolean) => void;
  setGlobalArrowColor: (color: string) => void;
  setCustomPaletteColor: (field: keyof ColorPalette, value: string) => void;
  duplicateNode: (nodeId: string) => void;
  copySelected: () => void;
  pasteClipboard: () => void;
  selectAll: () => void;
  setNodes: (nodes: DiagramNode[]) => void;
  setEdges: (edges: DiagramEdge[]) => void;
}

function getInitialState(): { nodes: DiagramNode[]; edges: DiagramEdge[] } {
  const saved = loadFromLocalStorage();
  if (saved && saved.nodes.length > 0) {
    return { nodes: saved.nodes, edges: saved.edges };
  }
  return {
    nodes: DEFAULT_SAMPLE_NODES,
    edges: DEFAULT_SAMPLE_EDGES,
  };
}

export const useDiagramStore = create<DiagramState>((set, get) => {
  const initial = getInitialState();

  return {
    nodes: initial.nodes,
    edges: initial.edges,
    selectedNodeId: null,
    selectedEdgeId: null,
    past: [],
    future: [],
    clipboard: null,
    toast: null,
    darkMode: false,
    showGrid: true,
    activePalette: DEFAULT_PALETTE_ID,
    textAlignLeft: false,
    globalArrowColor: "#000000",
    customPalette: { ...COLOR_PALETTES.find((p) => p.id === "custom")! },

    onNodesChange: (changes) => {
      set((state) => ({
        nodes: applyNodeChanges(changes, state.nodes) as DiagramNode[],
      }));
    },

    onEdgesChange: (changes) => {
      set((state) => ({
        edges: applyEdgeChanges(changes, state.edges) as DiagramEdge[],
      }));
    },

    onConnect: (connection) => {
      if (connection.source === connection.target) {
        get().setToast("Cannot connect a node to itself");
        return;
      }
      get().pushHistory();
      const edgeData = createDefaultEdgeData(get().activePalette);
      edgeData.color = get().globalArrowColor;
      const newEdge: DiagramEdge = {
        id: generateEdgeId(connection.source, connection.target),
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        type: "custom",
        animated: false,
        label: edgeData.label,
        style: { stroke: edgeData.color, strokeWidth: edgeData.width },
        data: edgeData,
      };
      set((state) => ({
        edges: addEdge(newEdge, state.edges) as DiagramEdge[],
      }));
    },

    addNode: (type, position) => {
      get().pushHistory();
      const paletteId = get().activePalette;
      const palette = paletteId === "custom" ? get().customPalette : undefined;
      const nodeData = createDefaultNodeData(type, paletteId);
      if (palette) {
        nodeData.color = palette.bodyColor;
        nodeData.headerColor = type === "and" || type === "or" ? palette.booleanHeaderColor : palette.headerColor;
        nodeData.textColor = palette.textColor;
        nodeData.descriptionColor = palette.descriptionColor;
        nodeData.borderColor = palette.borderColor;
      }
      const newNode: DiagramNode = {
        id: generateNodeId(),
        type: "custom",
        position,
        data: nodeData,
      };
      set((state) => ({
        nodes: [...state.nodes, newNode],
      }));
    },

    updateNodeData: (nodeId, data) => {
      set((state) => ({
        nodes: state.nodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } as NodeData }
            : node
        ),
      }));
    },

    updateEdgeData: (edgeId, data) => {
      set((state) => {
        const edges = state.edges.map((edge) => {
          if (edge.id !== edgeId) return edge;
          const updatedData = { ...edge.data, ...data } as EdgeData;
          return {
            ...edge,
            ...updatedData,
            data: updatedData,
            style: {
              stroke: updatedData.color,
              strokeWidth: updatedData.width,
            },
            label: updatedData.label,
            animated: updatedData.animated,
          } as DiagramEdge;
        });
        return { edges };
      });
    },

    deleteSelected: () => {
      const { selectedNodeId, selectedEdgeId, nodes, edges } = get();
      if (!selectedNodeId && !selectedEdgeId) return;
      get().pushHistory();
      if (selectedNodeId) {
        const nodeToDelete = nodes.find((n) => n.id === selectedNodeId);
        if (nodeToDelete) {
          const connectedEdges = edges.filter(
            (e) => e.source === selectedNodeId || e.target === selectedNodeId
          );
          set((state) => ({
            nodes: state.nodes.filter((n) => n.id !== selectedNodeId),
            edges: state.edges.filter(
              (e) => e.id !== selectedEdgeId && !connectedEdges.some((ce) => ce.id === e.id)
            ),
            selectedNodeId: null,
            selectedEdgeId: null,
          }));
        }
      } else if (selectedEdgeId) {
        set((state) => ({
          edges: state.edges.filter((e) => e.id !== selectedEdgeId),
          selectedEdgeId: null,
        }));
      }
    },

    deleteNode: (nodeId) => {
      get().pushHistory();
      set((state) => ({
        nodes: state.nodes.filter((n) => n.id !== nodeId),
        edges: state.edges.filter(
          (e) => e.source !== nodeId && e.target !== nodeId
        ),
        selectedNodeId:
          state.selectedNodeId === nodeId ? null : state.selectedNodeId,
      }));
    },

    deleteEdge: (edgeId) => {
      get().pushHistory();
      set((state) => ({
        edges: state.edges.filter((e) => e.id !== edgeId),
        selectedEdgeId:
          state.selectedEdgeId === edgeId ? null : state.selectedEdgeId,
      }));
    },

    selectNode: (nodeId) => {
      set({ selectedNodeId: nodeId, selectedEdgeId: null });
    },

    selectEdge: (edgeId) => {
      set({ selectedEdgeId: edgeId, selectedNodeId: null });
    },

    clearSelection: () => {
      set({ selectedNodeId: null, selectedEdgeId: null });
    },

    pushHistory: () => {
      const { nodes, edges, past } = get();
      const snapshot: HistorySnapshot = {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
      };
      const newPast = [...past, snapshot].slice(-MAX_HISTORY);
      set({ past: newPast, future: [] });
    },

    undo: () => {
      const { past, nodes, edges } = get();
      if (past.length === 0) return;
      const previous = past[past.length - 1];
      const currentSnapshot: HistorySnapshot = {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
      };
      set({
        nodes: previous.nodes,
        edges: previous.edges,
        past: past.slice(0, -1),
        future: [currentSnapshot, ...get().future],
        selectedNodeId: null,
        selectedEdgeId: null,
      });
    },

    redo: () => {
      const { future, nodes, edges } = get();
      if (future.length === 0) return;
      const next = future[0];
      const currentSnapshot: HistorySnapshot = {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
      };
      set({
        nodes: next.nodes,
        edges: next.edges,
        future: future.slice(1),
        past: [...get().past, currentSnapshot],
        selectedNodeId: null,
        selectedEdgeId: null,
      });
    },

    importDiagram: (json) => {
      try {
        const parsed = JSON.parse(json);
        if (!parsed.nodes || !parsed.edges) {
          get().setToast("Invalid diagram format: missing nodes or edges");
          return false;
        }
        get().pushHistory();
        set({
          nodes: parsed.nodes,
          edges: parsed.edges,
          selectedNodeId: null,
          selectedEdgeId: null,
          past: [],
          future: [],
        });
        get().setToast("Diagram imported successfully");
        return true;
      } catch {
        get().setToast("Invalid JSON format");
        return false;
      }
    },

    exportDiagram: () => {
      const { nodes, edges } = get();
      const diagram = {
        version: "1.0",
        name: "My Diagram",
        createdAt: new Date().toISOString(),
        viewport: { x: 0, y: 0, zoom: 1 },
        nodes,
        edges,
      };
      return JSON.stringify(diagram, null, 2);
    },

    resetCanvas: () => {
      get().pushHistory();
      set({
        nodes: [],
        edges: [],
        selectedNodeId: null,
        selectedEdgeId: null,
        past: [],
        future: [],
      });
      get().setToast("Canvas cleared");
    },

    setToast: (message) => {
      set({ toast: message });
      if (message !== null) {
        setTimeout(() => {
          set({ toast: null });
        }, 3000);
      }
    },

    toggleDarkMode: () => {
      const { darkMode } = get();
      const newMode = !darkMode;
      get().setGlobalArrowColor(newMode ? "#ffffff" : "#000000");
      set({ darkMode: newMode });
    },

    setDarkMode: (dark) => {
      set({ darkMode: dark });
    },

    toggleGrid: () => {
      set((state) => ({ showGrid: !state.showGrid }));
    },

    setShowGrid: (show) => {
      set({ showGrid: show });
    },

    toggleTextAlign: () => {
      set((state) => ({ textAlignLeft: !state.textAlignLeft }));
    },

    setTextAlignLeft: (align) => {
      set({ textAlignLeft: align });
    },

    setGlobalArrowColor: (color) => {
      get().pushHistory();
      set((state) => ({
        globalArrowColor: color,
        edges: state.edges.map((edge) => ({
          ...edge,
          data: { ...edge.data, color } as EdgeData,
          style: { ...edge.style, stroke: color },
        })),
      }));
    },

    setCustomPaletteColor: (field, value) => {
      const updated = { ...get().customPalette, [field]: value };
      set({ customPalette: updated });
      if (get().activePalette === "custom") {
        get().setPalette("custom");
      }
    },

    setPalette: (paletteId) => {
      const palette = paletteId === "custom" ? get().customPalette : getPalette(paletteId);
      get().pushHistory();
      set((state) => ({
        activePalette: paletteId,
        nodes: state.nodes.map((node) => {
          const isBool = node.data?.nodeType === "and" || node.data?.nodeType === "or";
          return {
            ...node,
            data: {
              ...node.data,
              color: palette.bodyColor,
              headerColor: isBool ? palette.booleanHeaderColor : palette.headerColor,
              textColor: palette.textColor,
              descriptionColor: palette.descriptionColor,
              borderColor: palette.borderColor,
            } as NodeData,
          };
        }),
        edges: state.edges.map((edge) => ({
          ...edge,
          data: {
            ...edge.data,
            color: palette.edgeColor,
          } as EdgeData,
          style: {
            ...edge.style,
            stroke: palette.edgeColor,
          },
        })),
      }));
    },

    duplicateNode: (nodeId) => {
      const { nodes, edges } = get();
      const sourceNode = nodes.find((n) => n.id === nodeId);
      if (!sourceNode) return;
      get().pushHistory();
      const newNodeId = generateNodeId();
      const newNode: DiagramNode = {
        ...sourceNode,
        id: newNodeId,
        position: {
          x: sourceNode.position.x + 40,
          y: sourceNode.position.y + 40,
        },
        selected: false,
      };
      set((state) => ({
        nodes: [...state.nodes, newNode],
        selectedNodeId: newNodeId,
        selectedEdgeId: null,
      }));
    },

    copySelected: () => {
      const { selectedNodeId, nodes, edges } = get();
      if (!selectedNodeId) return;
      const selectedNodes = nodes.filter(
        (n) => n.id === selectedNodeId || n.selected
      );
      if (selectedNodes.length === 0) return;
      const selectedIds = new Set(selectedNodes.map((n) => n.id));
      const connectedEdges = edges.filter(
        (e) => selectedIds.has(e.source) && selectedIds.has(e.target)
      );
      set({
        clipboard: {
          nodes: JSON.parse(JSON.stringify(selectedNodes)),
          edges: JSON.parse(JSON.stringify(connectedEdges)),
        },
      });
    },

    pasteClipboard: () => {
      const { clipboard, nodes } = get();
      if (!clipboard || clipboard.nodes.length === 0) return;
      get().pushHistory();
      const idMap = new Map<string, string>();
      const pastedNodes: DiagramNode[] = clipboard.nodes.map((n) => {
        const newId = generateNodeId();
        idMap.set(n.id, newId);
        return {
          ...n,
          id: newId,
          position: {
            x: n.position.x + 40,
            y: n.position.y + 40,
          },
          selected: true,
        };
      });
      const pastedEdges: DiagramEdge[] = clipboard.edges
        .map((e) => {
          const newSource = idMap.get(e.source);
          const newTarget = idMap.get(e.target);
          if (!newSource || !newTarget) return null;
          return {
            ...e,
            id: generateEdgeId(newSource, newTarget),
            source: newSource,
            target: newTarget,
          };
        })
        .filter((e): e is DiagramEdge => e !== null);
      const unselectedNodes = nodes.map((n) => ({ ...n, selected: false }));
      set({
        nodes: [...unselectedNodes, ...pastedNodes],
        edges: [...get().edges, ...pastedEdges],
        selectedNodeId: pastedNodes[0]?.id ?? null,
        selectedEdgeId: null,
      });
    },

    selectAll: () => {
      const { nodes } = get();
      set({
        nodes: nodes.map((n) => ({ ...n, selected: true })),
      });
    },

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),
  };
});

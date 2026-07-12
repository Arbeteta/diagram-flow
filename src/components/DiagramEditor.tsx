import { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  SelectionMode,
  useReactFlow,
  type DragEvent,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useDiagramStore } from "../store/diagramStore";
import { CustomNode } from "./CustomNode";
import { CustomEdge } from "./CustomEdge";
import { NodeContextMenu } from "./NodeContextMenu";
import { useUndoRedo } from "../hooks/useUndoRedo";

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export function DiagramEditor() {
  const nodes = useDiagramStore((s) => s.nodes);
  const edges = useDiagramStore((s) => s.edges);
  const onNodesChange = useDiagramStore((s) => s.onNodesChange);
  const onEdgesChange = useDiagramStore((s) => s.onEdgesChange);
  const onConnect = useDiagramStore((s) => s.onConnect);
  const addNode = useDiagramStore((s) => s.addNode);
  const selectNode = useDiagramStore((s) => s.selectNode);
  const selectEdge = useDiagramStore((s) => s.selectEdge);
  const clearSelection = useDiagramStore((s) => s.clearSelection);
  const deleteSelected = useDiagramStore((s) => s.deleteSelected);
  const copySelected = useDiagramStore((s) => s.copySelected);
  const pasteClipboard = useDiagramStore((s) => s.pasteClipboard);
  const duplicateNode = useDiagramStore((s) => s.duplicateNode);
  const selectAll = useDiagramStore((s) => s.selectAll);
  const pushHistory = useDiagramStore((s) => s.pushHistory);
  const darkMode = useDiagramStore((s) => s.darkMode);
  const showGrid = useDiagramStore((s) => s.showGrid);
  const selectedNodeId = useDiagramStore((s) => s.selectedNodeId);
  const selectedEdgeId = useDiagramStore((s) => s.selectedEdgeId);
  const setToast = useDiagramStore((s) => s.setToast);

  const [contextMenu, setContextMenu] = useState<{
    nodeId: string;
    x: number;
    y: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { screenToFlowPosition } = useReactFlow();

  useUndoRedo();

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      addNode(type, position);
      setToast(`Added ${type} node`);
    },
    [addNode, setToast, screenToFlowPosition]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: { id: string }) => {
      selectEdge(edge.id);
    },
    [selectEdge]
  );

  const onPaneClick = useCallback(() => {
    clearSelection();
    setContextMenu(null);
  }, [clearSelection]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: { id: string }) => {
      event.preventDefault();
      selectNode(node.id);
      setContextMenu({
        nodeId: node.id,
        x: event.clientX,
        y: event.clientY,
      });
    },
    [selectNode]
  );

  const onNodesDelete = useCallback(
    (deletedNodes: { id: string }[]) => {
      if (deletedNodes.length > 0) {
        pushHistory();
      }
    },
    [pushHistory]
  );

  const onEdgesDelete = useCallback(
    (deletedEdges: { id: string }[]) => {
      if (deletedEdges.length > 0) {
        pushHistory();
      }
    },
    [pushHistory]
  );

  const onNodeDragStart = useCallback(() => {
    pushHistory();
    setIsDragging(true);
  }, [pushHistory]);

  const onNodeDragStop = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if (isInput) return;

      const ctrl = event.ctrlKey || event.metaKey;

      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedNodeId || selectedEdgeId) {
          event.preventDefault();
          deleteSelected();
        }
      }

      if (ctrl && event.key === "c") {
        event.preventDefault();
        copySelected();
      }

      if (ctrl && event.key === "v") {
        event.preventDefault();
        pasteClipboard();
      }

      if (ctrl && event.key === "d") {
        event.preventDefault();
        if (selectedNodeId) {
          duplicateNode(selectedNodeId);
        }
      }

      if (ctrl && event.key === "a") {
        event.preventDefault();
        selectAll();
      }

      if (event.key === "Escape") {
        clearSelection();
      }

      if (ctrl && event.key === "s") {
        event.preventDefault();
        const json = useDiagramStore.getState().exportDiagram();
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
        a.download = `diagram-${stamp}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setToast("Diagram saved");
      }

      if (ctrl && event.key === "o") {
        event.preventDefault();
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) return;
          const text = await file.text();
          useDiagramStore.getState().importDiagram(text);
        };
        input.click();
      }
    },
    [
      selectedNodeId,
      selectedEdgeId,
      deleteSelected,
      copySelected,
      pasteClipboard,
      duplicateNode,
      selectAll,
      clearSelection,
      setToast,
    ]
  );

  return (
    <div
      className="flex-1 relative"
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        selectionMode={SelectionMode.Partial}
        selectionOnDrag
        panOnDrag={[1, 2]}
        selectNodesOnDrag={false}
        fitView
        colorMode={darkMode ? "dark" : "light"}
        deleteKeyCode={null}
        snapToGrid
        snapGrid={[20, 20]}
        className={`bg-white dark:bg-[#141414] ${!showGrid ? "handles-hidden" : ""}`}
      >
        {showGrid && (
          <Background
            variant={BackgroundVariant.Cross}
            gap={20}
            size={isDragging ? 3.5 : 2}
            color={darkMode ? "#333333" : "#D1D5DB"}
          />
        )}
        <Controls
          className="!rounded-lg !shadow-md !border !border-gray-200 dark:!border-gray-700"
        />
        <MiniMap
          nodeColor={(node) => (node.data as { color?: string })?.color ?? "#6B7280"}
          maskColor={darkMode ? "rgba(31,41,55,0.7)" : "rgba(255,255,255,0.5)"}
          className="!rounded-lg !shadow-md !border !border-gray-200 dark:!border-gray-700"
        />
      </ReactFlow>

      {contextMenu && (
        <NodeContextMenu
          nodeId={contextMenu.nodeId}
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Toast notification */}
      <ToastNotification />
    </div>
  );
}

function ToastNotification() {
  const toast = useDiagramStore((s) => s.toast);

  if (!toast) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 toast-enter">
      <div className="bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
        {toast}
      </div>
    </div>
  );
}

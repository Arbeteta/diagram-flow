import { useCallback, useEffect, useRef } from "react";
import { useDiagramStore } from "../store/diagramStore";

interface NodeContextMenuProps {
  nodeId: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export function NodeContextMenu({ nodeId, position, onClose }: NodeContextMenuProps) {
  const deleteNode = useDiagramStore((s) => s.deleteNode);
  const duplicateNode = useDiagramStore((s) => s.duplicateNode);
  const selectNode = useDiagramStore((s) => s.selectNode);
  const nodes = useDiagramStore((s) => s.nodes);
  const setNodes = useDiagramStore((s) => s.setNodes);
  const pushHistory = useDiagramStore((s) => s.pushHistory);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleEditLabel = useCallback(() => {
    selectNode(nodeId);
    onClose();
  }, [nodeId, selectNode, onClose]);

  const handleDuplicate = useCallback(() => {
    duplicateNode(nodeId);
    onClose();
  }, [nodeId, duplicateNode, onClose]);

  const handleDelete = useCallback(() => {
    deleteNode(nodeId);
    onClose();
  }, [nodeId, deleteNode, onClose]);

  const handleBringForward = useCallback(() => {
    pushHistory();
    const idx = nodes.findIndex((n) => n.id === nodeId);
    if (idx < nodes.length - 1) {
      const updated = [...nodes];
      [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
      setNodes(updated);
    }
    onClose();
  }, [nodeId, nodes, setNodes, pushHistory, onClose]);

  const handleSendBackward = useCallback(() => {
    pushHistory();
    const idx = nodes.findIndex((n) => n.id === nodeId);
    if (idx > 0) {
      const updated = [...nodes];
      [updated[idx], updated[idx - 1]] = [updated[idx - 1], updated[idx]];
      setNodes(updated);
    }
    onClose();
  }, [nodeId, nodes, setNodes, pushHistory, onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 min-w-40 z-50"
      style={{ left: position.x, top: position.y }}
    >
      <button
        onClick={handleEditLabel}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        Edit Label
      </button>
      <button
        onClick={handleDuplicate}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        Duplicate
      </button>
      <hr className="border-gray-200 dark:border-gray-700" />
      <button
        onClick={handleDelete}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        Delete
      </button>
      <hr className="border-gray-200 dark:border-gray-700" />
      <button
        onClick={handleBringForward}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        Bring Forward
      </button>
      <button
        onClick={handleSendBackward}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        Send Backward
      </button>
    </div>
  );
}

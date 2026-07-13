import { useCallback, useEffect, useState } from "react";
import { useDiagramStore } from "../store/diagramStore";
import { ColorPicker } from "./ColorPicker";
import type { NodeData, EdgeData } from "../types";

export function PropertiesPanel() {
  const selectedNodeId = useDiagramStore((s) => s.selectedNodeId);
  const selectedEdgeId = useDiagramStore((s) => s.selectedEdgeId);
  const nodes = useDiagramStore((s) => s.nodes);
  const edges = useDiagramStore((s) => s.edges);
  const updateNodeData = useDiagramStore((s) => s.updateNodeData);
  const updateEdgeData = useDiagramStore((s) => s.updateEdgeData);
  const pushHistory = useDiagramStore((s) => s.pushHistory);
  const deleteNode = useDiagramStore((s) => s.deleteNode);
  const deleteEdge = useDiagramStore((s) => s.deleteEdge);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId);

  if (!selectedNode && !selectedEdge) {
    return null;
  }

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-y-auto shrink-0">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {selectedNode ? "Node Properties" : "Edge Properties"}
        </h2>
      </div>
      <div className="p-3 space-y-3">
        {selectedNode && (
          <NodeProperties
            data={selectedNode.data as NodeData}
            nodeId={selectedNode.id}
            onUpdate={(data) => updateNodeData(selectedNode.id, data)}
            onPushHistory={pushHistory}
            onDelete={() => deleteNode(selectedNode.id)}
          />
        )}
        {selectedEdge && (
          <EdgeProperties
            data={selectedEdge.data as EdgeData}
            edgeId={selectedEdge.id}
            onUpdate={(data) => updateEdgeData(selectedEdge.id, data)}
            onPushHistory={pushHistory}
            onDelete={() => deleteEdge(selectedEdge.id)}
          />
        )}
      </div>
    </aside>
  );
}

interface NodePropertiesProps {
  data: NodeData;
  nodeId: string;
  onUpdate: (data: Partial<NodeData>) => void;
  onPushHistory: () => void;
  onDelete: () => void;
}

function NodeProperties({ data, onUpdate, onPushHistory, onDelete }: NodePropertiesProps) {
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleChange = useCallback(
    (field: keyof NodeData, value: string | number) => {
      const newData = { ...localData, [field]: value };
      setLocalData(newData);
      onPushHistory();
      onUpdate({ [field]: value });
    },
    [localData, onUpdate, onPushHistory]
  );

  const isComplex = localData.nodeType === "complex";

  return (
    <>
      <PropRow label="Label">
        <input
          type="text"
          value={localData.label}
          onChange={(e) => handleChange("label", e.target.value)}
          className="prop-input"
        />
      </PropRow>
      {!isComplex && (
        <PropRow label="Category">
          <input
            type="text"
            value={localData.category ?? ""}
            onChange={(e) => handleChange("category", e.target.value)}
            className="prop-input"
            placeholder="Optional category text..."
          />
        </PropRow>
      )}
      {isComplex && (
        <PropRow label="Box Title">
          <input
            type="text"
            value={localData.boxTitle ?? ""}
            onChange={(e) => handleChange("boxTitle", e.target.value)}
            className="prop-input"
            placeholder="Inner box title..."
          />
        </PropRow>
      )}
      <PropRow label="Description">
        <textarea
          value={localData.description ?? ""}
          onChange={(e) => handleChange("description", e.target.value)}
          className="prop-input resize-none"
          rows={2}
          placeholder="Optional context text..."
        />
      </PropRow>
      <PropRow label="Width">
        <input
          type="number"
          min={80}
          max={600}
          value={localData.width}
          onChange={(e) => handleChange("width", parseInt(e.target.value) || 180)}
          className="prop-input"
        />
      </PropRow>
      <PropRow label="Height">
        <input
          type="number"
          min={40}
          max={400}
          value={localData.height}
          onChange={(e) => handleChange("height", parseInt(e.target.value) || 80)}
          className="prop-input"
        />
      </PropRow>
      <hr className="border-gray-200 dark:border-gray-700" />
      <PropRow label="Header Color">
        <ColorPicker
          value={localData.headerColor ?? localData.color}
          onChange={(v) => handleChange("headerColor", v)}
        />
      </PropRow>
      <PropRow label="Body Color">
        <ColorPicker
          value={localData.color}
          onChange={(v) => handleChange("color", v)}
        />
      </PropRow>
      <PropRow label="Border Color">
        <ColorPicker
          value={localData.borderColor}
          onChange={(v) => handleChange("borderColor", v)}
        />
      </PropRow>
      <PropRow label="Border Width">
        <input
          type="number"
          min={0}
          max={10}
          value={localData.borderWidth}
          onChange={(e) => handleChange("borderWidth", parseInt(e.target.value) || 0)}
          className="prop-input"
        />
      </PropRow>
      <PropRow label="Border Style">
        <select
          value={localData.borderStyle}
          onChange={(e) =>
            handleChange("borderStyle", e.target.value as NodeData["borderStyle"])
          }
          className="prop-input"
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </PropRow>
      <PropRow label="Border Radius">
        <input
          type="number"
          min={0}
          max={50}
          value={localData.borderRadius}
          onChange={(e) => handleChange("borderRadius", parseInt(e.target.value) || 0)}
          className="prop-input"
        />
      </PropRow>
      <PropRow label="Font Size">
        <input
          type="number"
          min={10}
          max={48}
          value={localData.fontSize}
          onChange={(e) => handleChange("fontSize", parseInt(e.target.value) || 14)}
          className="prop-input"
        />
      </PropRow>
      <hr className="border-gray-200 dark:border-gray-700" />
      <button onClick={onDelete} className="btn-danger w-full">
        Delete Node
      </button>
    </>
  );
}

interface EdgePropertiesProps {
  data: EdgeData;
  edgeId: string;
  onUpdate: (data: Partial<EdgeData>) => void;
  onPushHistory: () => void;
  onDelete: () => void;
}

function EdgeProperties({ data, onUpdate, onPushHistory, onDelete }: EdgePropertiesProps) {
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleChange = useCallback(
    (field: keyof EdgeData, value: string | boolean | number) => {
      const newData = { ...localData, [field]: value };
      setLocalData(newData);
      onPushHistory();
      onUpdate({ [field]: value });
    },
    [localData, onUpdate, onPushHistory]
  );

  return (
    <>
      <PropRow label="Label">
        <input
          type="text"
          value={localData.label}
          onChange={(e) => handleChange("label", e.target.value)}
          className="prop-input"
        />
      </PropRow>
      <PropRow label="Color">
        <ColorPicker
          value={localData.color}
          onChange={(v) => handleChange("color", v)}
        />
      </PropRow>
      <PropRow label="Width">
        <input
          type="number"
          min={1}
          max={10}
          value={localData.width}
          onChange={(e) => handleChange("width", parseInt(e.target.value) || 2)}
          className="prop-input"
        />
      </PropRow>
      <PropRow label="Style">
        <select
          value={localData.style}
          onChange={(e) =>
            handleChange("style", e.target.value as EdgeData["style"])
          }
          className="prop-input"
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </PropRow>
      <PropRow label="Tip">
        <select
          value={localData.markerStyle ?? "arrow"}
          onChange={(e) =>
            handleChange("markerStyle", e.target.value as EdgeData["markerStyle"])
          }
          className="prop-input"
        >
          <option value="arrow">Arrow</option>
          <option value="circle">Circle</option>
        </select>
      </PropRow>
      <PropRow label="Animated">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={localData.animated}
            onChange={(e) => handleChange("animated", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {localData.animated ? "On" : "Off"}
          </span>
        </label>
      </PropRow>
      <hr className="border-gray-200 dark:border-gray-700" />
      <button onClick={onDelete} className="btn-danger w-full">
        Delete Edge
      </button>
    </>
  );
}

interface PropRowProps {
  label: string;
  children: React.ReactNode;
}

function PropRow({ label, children }: PropRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

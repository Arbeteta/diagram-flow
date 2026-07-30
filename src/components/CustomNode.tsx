import { memo, useCallback, useState, useEffect, useRef, useMemo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { marked } from "marked";
import type { DiagramNode, NodeData } from "../types";
import { useDiagramStore } from "../store/diagramStore";

type CustomNodeProps = NodeProps<DiagramNode>;

export const CustomNode = memo(function CustomNode({ id, data, selected }: CustomNodeProps) {
  const nodeData = data as unknown as NodeData;
  const updateNodeData = useDiagramStore((s) => s.updateNodeData);
  const pushHistory = useDiagramStore((s) => s.pushHistory);
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(nodeData.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditLabel(nodeData.label);
  }, [nodeData.label]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setEditLabel(nodeData.label);
  }, [nodeData.label]);

  const handleBlur = useCallback(() => {
    if (isEditing && editLabel !== nodeData.label) {
      pushHistory();
      updateNodeData(id, { label: editLabel });
    }
    setIsEditing(false);
  }, [isEditing, editLabel, nodeData.label, pushHistory, updateNodeData, id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleBlur();
      }
      if (e.key === "Escape") {
        setEditLabel(nodeData.label);
        setIsEditing(false);
      }
    },
    [handleBlur, nodeData.label]
  );

  const headerColor = nodeData.headerColor ?? nodeData.color;
  const textColor = nodeData.textColor ?? "#ffffff";
  const description = nodeData.description?.trim();
  const hasDescription = Boolean(description);
  const descriptionHtml = useMemo(() => {
    if (!description) return "";
    return marked.parse(description, { breaks: true }) as string;
  }, [description]);
  const category = nodeData.category?.trim();
  const hasCategory = Boolean(category);
  const textAlignLeft = useDiagramStore((s) => s.textAlignLeft);
  const nodeType = nodeData.nodeType;
  const isBoolean = nodeType === "and" || nodeType === "or";
  const isHexagon = nodeType === "hexagon";
  const isCircle = nodeType === "circle";
  const isPill = nodeType === "pill";
  const isComplex = nodeType === "complex";
  const forceCenter = isBoolean || isHexagon || isCircle || isPill;
  const textAlign = forceCenter ? "center" : textAlignLeft ? "left" : "center";

  const containerStyle: React.CSSProperties = {
    background: hasDescription ? undefined : headerColor,
    borderColor: nodeData.borderColor,
    borderStyle: nodeData.borderStyle,
    borderWidth: nodeData.borderWidth,
    borderRadius: isCircle ? "50%" : nodeData.borderRadius,
    clipPath: isHexagon
      ? "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
      : undefined,
    minWidth: nodeData.width,
    maxWidth: 300,
    minHeight: isCircle ? nodeData.width : nodeData.height,
    height: isCircle ? nodeData.width : undefined,
    fontSize: nodeData.fontSize,
    outline: selected ? `2px dashed #f97316` : undefined,
    outlineOffset: "2px",
    animation: selected ? "outline-breathe 1.4s ease-in-out infinite" : undefined,
  };

  if (isComplex) {
    return (
      <div
        className="flex flex-col cursor-grab active:cursor-grabbing shadow-md transition-shadow hover:shadow-lg relative overflow-hidden"
        style={containerStyle}
        onDoubleClick={handleDoubleClick}
      >
        <Handle type="target" position={Position.Top} id="top" className="!w-3 !h-3 !border-2 !border-white !bg-gray-400 !shadow-sm" />
        <Handle type="source" position={Position.Right} id="right" className="!w-3 !h-3 !border-2 !border-white !bg-gray-400 !shadow-sm" />
        <Handle type="source" position={Position.Bottom} id="bottom" className="!w-3 !h-3 !border-2 !border-white !bg-gray-400 !shadow-sm" />
        <Handle type="target" position={Position.Left} id="left" className="!w-3 !h-3 !border-2 !border-white !bg-gray-400 !shadow-sm" />

        {/* Header / title */}
        <div
          className="flex items-center px-4 py-2 shrink-0"
          style={{ background: headerColor }}
        >
          <span
            className="font-bold select-none pointer-events-none leading-tight truncate"
            style={{ fontSize: nodeData.fontSize, textAlign: "left", color: textColor }}
          >
            {nodeData.label}
          </span>
        </div>

        {/* Body / nested description box */}
        <div
          className="flex-1 flex items-stretch p-3"
          style={{ background: nodeData.color }}
        >
          <div
            className="flex-1 flex flex-col justify-center rounded-lg px-3 py-2"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            {nodeData.boxTitle && (
              <span
                className="font-bold select-none pointer-events-none w-full leading-tight truncate"
                style={{ fontSize: 11, color: textColor }}
              >
                {nodeData.boxTitle}
              </span>
            )}
            <div
              className="select-none pointer-events-none w-full leading-snug [&_strong]:font-bold [&_em]:italic [&_code]:bg-white/10 [&_code]:px-1 [&_code]:rounded [&_a]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
              style={{
                fontSize: 12,
                color: nodeData.descriptionColor ?? "#d8d8d8",
                textAlign: "left",
              }}
              dangerouslySetInnerHTML={{ __html: descriptionHtml || "Description" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col cursor-grab active:cursor-grabbing shadow-md transition-shadow hover:shadow-lg relative overflow-hidden"
      style={containerStyle}
      onDoubleClick={handleDoubleClick}
    >
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-3 !h-3 !border-2 !border-white !bg-gray-400 !shadow-sm"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3 !h-3 !border-2 !border-white !bg-gray-400 !shadow-sm"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-3 !h-3 !border-2 !border-white !bg-gray-400 !shadow-sm"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3 !h-3 !border-2 !border-white !bg-gray-400 !shadow-sm"
      />

      {/* Header / label area */}
      <div
        className={`flex flex-col items-center justify-center px-3 py-1 ${hasDescription ? "shrink-0" : "flex-1"}`}
        style={{ background: hasDescription ? headerColor : "transparent" }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="bg-transparent font-bold w-full outline-none border-b border-white/50"
            style={{ fontSize: nodeData.fontSize, textAlign, color: textColor }}
          />
        ) : (
          <>
            {hasCategory && (
              <span
                className="text-xs select-none pointer-events-none w-full leading-tight font-mono"
                style={{ textAlign, color: textColor, opacity: 0.6 }}
              >
                {category}
              </span>
            )}
            <span
              className="font-bold select-none pointer-events-none w-full leading-none"
              style={{ textAlign, color: textColor }}
            >
              {nodeData.label}
            </span>
          </>
        )}
      </div>

      {/* Body: only rendered when description is present */}
      {!isEditing && hasDescription && (
        <div
          className="flex-1 flex items-center justify-center px-3 py-1"
          style={{ background: nodeData.color }}
        >
          <div
            className="text-xs select-none pointer-events-none w-full leading-tight [&_strong]:font-bold [&_em]:italic [&_code]:bg-white/10 [&_code]:px-1 [&_code]:rounded [&_a]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
            style={{ color: nodeData.descriptionColor ?? "#d8d8d8", textAlign }}
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        </div>
      )}
    </div>
  );
});

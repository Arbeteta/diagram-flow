import { memo } from "react";
import {
  BaseEdge,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";
import type { DiagramEdge, EdgeData } from "../types";

type CustomEdgeProps = EdgeProps<DiagramEdge>;

const DEFAULT_EDGE_COLOR = "#000000";

export const CustomEdge = memo(function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: CustomEdgeProps) {
  const edgeData = data as unknown as EdgeData;
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
  });

  const color1 = edgeData?.color ?? DEFAULT_EDGE_COLOR;
  const color2 = edgeData?.color2;
  const hasGradient = Boolean(color2 && color2 !== color1);
  const gradientId = `grad-${id}`;
  const strokeRef = hasGradient ? `url(#${gradientId})` : color1;

  const strokeDasharray =
    edgeData?.style === "dashed"
      ? "8 4"
      : edgeData?.style === "dotted"
        ? "2 2"
        : undefined;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeRef,
          strokeWidth: edgeData?.width ?? 2,
          strokeDasharray,
        }}
        className={edgeData?.animated ? "!stroke-dasharray-[8,4] [animation:dash-motion_0.5s_linear_infinite]" : ""}
        markerEnd={`url(#arrow-${id})`}
      />
      {selected && (
        <rect
          x={labelX - 40}
          y={labelY - 12}
          width={80}
          height={24}
          rx={4}
          fill="#3B82F6"
          fillOpacity={0.15}
          className="pointer-events-none"
        />
      )}
      {edgeData?.label && (
        <foreignObject
          x={labelX - 50}
          y={labelY - 12}
          width={100}
          height={24}
          className="overflow-visible"
        >
          <div
            className="flex items-center justify-center"
            style={{ width: 100, height: 24 }}
          >
            <span
              className="px-2 py-0.5 text-xs font-medium rounded shadow-sm"
              style={{
                background: "white",
                color: color1,
                border: `1px solid ${color1}`,
              }}
            >
              {edgeData.label}
            </span>
          </div>
        </foreignObject>
      )}
      <defs>
        {hasGradient && (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        )}
        <marker
          id={`arrow-${id}`}
          markerWidth={edgeData?.markerStyle === "circle" ? "7" : edgeData?.markerStyle === "minimal" ? "8" : "6"}
          markerHeight={edgeData?.markerStyle === "circle" ? "7" : edgeData?.markerStyle === "minimal" ? "8" : "4"}
          refX={edgeData?.markerStyle === "circle" ? "3.5" : edgeData?.markerStyle === "minimal" ? "6" : "4"}
          refY={edgeData?.markerStyle === "circle" ? "3.5" : edgeData?.markerStyle === "minimal" ? "4" : "2"}
          orient="auto"
        >
          {edgeData?.markerStyle === "circle" ? (
            <circle cx="3.5" cy="3.5" r="2.5" fill={color2 ?? color1} />
          ) : edgeData?.markerStyle === "minimal" ? (
            <g stroke={color2 ?? color1} strokeWidth="0.8" strokeLinecap="round" fill="none">
              <line x1="0" y1="0" x2="6" y2="4" />
              <line x1="0" y1="8" x2="6" y2="4" />
            </g>
          ) : (
            <polygon
              points="0 0, 6 2, 0 4"
              fill={color2 ?? color1}
            />
          )}
        </marker>
      </defs>
    </>
  );
});

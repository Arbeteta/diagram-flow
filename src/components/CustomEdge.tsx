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
          stroke: edgeData?.color ?? DEFAULT_EDGE_COLOR,
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
                color: edgeData?.color ?? DEFAULT_EDGE_COLOR,
                border: `1px solid ${edgeData?.color ?? DEFAULT_EDGE_COLOR}`,
              }}
            >
              {edgeData.label}
            </span>
          </div>
        </foreignObject>
      )}
      <defs>
        <marker
          id={`arrow-${id}`}
          markerWidth={edgeData?.markerStyle === "circle" ? "7" : "6"}
          markerHeight={edgeData?.markerStyle === "circle" ? "7" : "4"}
          refX={edgeData?.markerStyle === "circle" ? "3.5" : "4"}
          refY={edgeData?.markerStyle === "circle" ? "3.5" : "2"}
          orient="auto"
        >
          {edgeData?.markerStyle === "circle" ? (
            <circle cx="3.5" cy="3.5" r="2.5" fill={edgeData?.color ?? DEFAULT_EDGE_COLOR} />
          ) : (
            <polygon
              points="0 0, 6 2, 0 4"
              fill={edgeData?.color ?? DEFAULT_EDGE_COLOR}
            />
          )}
        </marker>
      </defs>
    </>
  );
});

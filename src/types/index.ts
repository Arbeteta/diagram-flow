import type { Node, Edge } from "@xyflow/react";

export interface NodeData {
  label: string;
  category?: string;
  boxTitle?: string;
  nodeType?: string;
  description?: string;
  color: string;
  headerColor?: string;
  descriptionColor?: string;
  fontSize: number;
  borderColor: string;
  borderStyle: "solid" | "dashed" | "dotted";
  borderWidth: number;
  width: number;
  height: number;
  borderRadius: number;
}

export interface EdgeData {
  label: string;
  color: string;
  width: number;
  animated: boolean;
  style: "solid" | "dashed" | "dotted";
  markerStyle: "arrow" | "circle";
}

export type DiagramNode = Node<NodeData>;
export type DiagramEdge = Edge<EdgeData>;

export interface DiagramExport {
  version: string;
  name: string;
  createdAt: string;
  viewport: { x: number; y: number; zoom: number };
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface HistorySnapshot {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export type NodeType = "node" | "and" | "or" | "multinode" | "hexagon" | "circle" | "pill" | "complex";

export interface NodeTypeDefinition {
  type: NodeType;
  label: string;
  defaultColor: string;
  defaultLabel: string;
  icon: string;
  small?: boolean;
}

export interface ColorPalette {
  id: string;
  label: string;
  headerColor: string;
  bodyColor: string;
  edgeColor: string;
  borderColor: string;
  descriptionColor: string;
  booleanHeaderColor: string;
}

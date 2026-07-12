import type { NodeData, EdgeData, NodeTypeDefinition, ColorPalette, DiagramNode, DiagramEdge } from "../types";

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: "grey",
    label: "Grey / Black",
    headerColor: "#545454",
    bodyColor: "#1f1f1f",
    edgeColor: "#000000",
    borderColor: "#545454",
    descriptionColor: "#d8d8d8",
    booleanHeaderColor: "#991b1b",
  },
  {
    id: "purple",
    label: "Purples / Violets",
    headerColor: "#6d28d9",
    bodyColor: "#2e1065",
    edgeColor: "#000000",
    borderColor: "#6d28d9",
    descriptionColor: "#c4b5fd",
    booleanHeaderColor: "#6d28d9",
  },
  {
    id: "red",
    label: "Reddish",
    headerColor: "#b91c1c",
    bodyColor: "#450a0a",
    edgeColor: "#000000",
    borderColor: "#b91c1c",
    descriptionColor: "#fca5a5",
    booleanHeaderColor: "#b91c1c",
  },
  {
    id: "green",
    label: "Greenish",
    headerColor: "#047857",
    bodyColor: "#022c22",
    edgeColor: "#000000",
    borderColor: "#047857",
    descriptionColor: "#6ee7b7",
    booleanHeaderColor: "#047857",
  },
  {
    id: "custom",
    label: "Custom",
    headerColor: "#545454",
    bodyColor: "#1f1f1f",
    edgeColor: "#000000",
    borderColor: "#545454",
    descriptionColor: "#d8d8d8",
    booleanHeaderColor: "#991b1b",
  },
];

export const DEFAULT_PALETTE_ID = "grey";

export function getPalette(paletteId: string): ColorPalette {
  return COLOR_PALETTES.find((p) => p.id === paletteId) ?? COLOR_PALETTES[0];
}

export const NODE_TYPE_DEFINITIONS: NodeTypeDefinition[] = [
  {
    type: "multinode",
    label: "MultiNode",
    defaultColor: "#545454",
    defaultLabel: "Title",
    icon: "▣",
  },
  {
    type: "complex",
    label: "Complex",
    defaultColor: "#545454",
    defaultLabel: "Title",
    icon: "◈",
  },
  {
    type: "node",
    label: "Node",
    defaultColor: "#545454",
    defaultLabel: "Node",
    icon: "■",
  },
  {
    type: "hexagon",
    label: "Hexagon",
    defaultColor: "#545454",
    defaultLabel: "Hexagon",
    icon: "⬡",
  },
  {
    type: "circle",
    label: "Circle",
    defaultColor: "#545454",
    defaultLabel: "Circle",
    icon: "●",
  },
  {
    type: "pill",
    label: "Pill",
    defaultColor: "#545454",
    defaultLabel: "Pill",
    icon: "▬",
  },
  {
    type: "and",
    label: "AND",
    defaultColor: "#545454",
    defaultLabel: "AND",
    icon: "∧",
    small: true,
  },
  {
    type: "or",
    label: "OR",
    defaultColor: "#545454",
    defaultLabel: "OR",
    icon: "∨",
    small: true,
  },
];

export function createDefaultNodeData(type: string, paletteId?: string): NodeData {
  const def = NODE_TYPE_DEFINITIONS.find((d) => d.type === type);
  const palette = getPalette(paletteId ?? DEFAULT_PALETTE_ID);
  const isSmall = def?.small ?? false;
  const isCircle = type === "circle";
  const isHexagon = type === "hexagon";
  const isPill = type === "pill";
  const isComplex = type === "complex";
  return {
    label: def?.defaultLabel ?? "Node",
    category: type === "multinode" ? "Category" : undefined,
    boxTitle: isComplex ? "Box Title" : undefined,
    nodeType: type,
    description: "",
    color: palette.bodyColor,
    headerColor: type === "and" || type === "or" ? palette.booleanHeaderColor : palette.headerColor,
    descriptionColor: palette.descriptionColor,
    fontSize: isSmall ? 18 : isPill ? 13 : isComplex ? 15 : isCircle || isHexagon ? 14 : 14,
    borderColor: palette.borderColor,
    borderStyle: "solid",
    borderWidth: 2,
    width: isSmall ? 100 : isPill ? 180 : isComplex ? 280 : isCircle ? 120 : isHexagon ? 120 : 180,
    height: isSmall ? 50 : isPill ? 44 : isComplex ? 140 : isCircle ? 120 : isHexagon ? 104 : 80,
    borderRadius: isPill ? 9999 : isCircle ? 9999 : isComplex ? 16 : isHexagon ? 10 : 8,
  };
}

export function createDefaultEdgeData(paletteId?: string): EdgeData {
  const palette = getPalette(paletteId ?? DEFAULT_PALETTE_ID);
  return {
    label: "",
    color: palette.edgeColor,
    width: 2,
    animated: false,
    style: "solid",
    markerStyle: "arrow",
  };
}

export const DEFAULT_SAMPLE_NODES: DiagramNode[] = [
  {
    id: "sample-1",
    type: "custom",
    position: { x: 250, y: 100 },
    data: {
      label: "Node",
      color: "#1f1f1f",
      headerColor: "#545454",
      descriptionColor: "#d8d8d8",
      fontSize: 14,
      borderColor: "#545454",
      borderStyle: "solid",
      borderWidth: 2,
      width: 180,
      height: 80,
      borderRadius: 8,
    },
  },
  {
    id: "sample-2",
    type: "custom",
    position: { x: 290, y: 260 },
    data: {
      label: "AND",
      color: "#1f1f1f",
      headerColor: "#545454",
      descriptionColor: "#d8d8d8",
      fontSize: 18,
      borderColor: "#545454",
      borderStyle: "solid",
      borderWidth: 2,
      width: 100,
      height: 50,
      borderRadius: 8,
    },
  },
  {
    id: "sample-3",
    type: "custom",
    position: { x: 290, y: 390 },
    data: {
      label: "OR",
      color: "#1f1f1f",
      headerColor: "#545454",
      descriptionColor: "#d8d8d8",
      fontSize: 18,
      borderColor: "#545454",
      borderStyle: "solid",
      borderWidth: 2,
      width: 100,
      height: 50,
      borderRadius: 8,
    },
  },
];

export const DEFAULT_SAMPLE_EDGES: DiagramEdge[] = [
  {
    id: "e-sample-1-2",
    source: "sample-1",
    target: "sample-2",
    type: "custom",
    animated: false,
    label: "next",
    style: { stroke: "#7F35B2", strokeWidth: 2 },
    data: { label: "next", color: "#7F35B2", width: 2, animated: false, style: "solid", markerStyle: "arrow" },
  },
  {
    id: "e-sample-2-3",
    source: "sample-2",
    target: "sample-3",
    type: "custom",
    animated: false,
    label: "then",
    style: { stroke: "#7F35B2", strokeWidth: 2 },
    data: { label: "then", color: "#7F35B2", width: 2, animated: false, style: "solid", markerStyle: "arrow" },
  },
];

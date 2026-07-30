import type { NodeData, EdgeData, NodeTypeDefinition, ColorPalette, DiagramNode, DiagramEdge } from "../types";

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: "grey",
    label: "Stone",
    headerColor: "#475569",
    bodyColor: "#1e293b",
    edgeColor: "#000000",
    borderColor: "#475569",
    textColor: "#ffffff",
    descriptionColor: "#e2e8f0",
    booleanHeaderColor: "#991b1b",
  },
  {
    id: "gray",
    label: "Gray",
    headerColor: "#4b5563",
    bodyColor: "#1f2937",
    edgeColor: "#000000",
    borderColor: "#4b5563",
    textColor: "#ffffff",
    descriptionColor: "#e5e7eb",
    booleanHeaderColor: "#991b1b",
  },
  {
    id: "purple",
    label: "Purple",
    headerColor: "#a21caf",
    bodyColor: "#701a75",
    edgeColor: "#000000",
    borderColor: "#a21caf",
    textColor: "#ffffff",
    descriptionColor: "#f5d0fe",
    booleanHeaderColor: "#a21caf",
  },
  {
    id: "red",
    label: "Rose",
    headerColor: "#be123c",
    bodyColor: "#881337",
    edgeColor: "#000000",
    borderColor: "#be123c",
    textColor: "#ffffff",
    descriptionColor: "#fecdd3",
    booleanHeaderColor: "#be123c",
  },
  {
    id: "green",
    label: "Emerald",
    headerColor: "#047857",
    bodyColor: "#064e3b",
    edgeColor: "#000000",
    borderColor: "#047857",
    textColor: "#ffffff",
    descriptionColor: "#a7f3d0",
    booleanHeaderColor: "#047857",
  },
  {
    id: "custom",
    label: "Custom",
    headerColor: "#475569",
    bodyColor: "#1e293b",
    edgeColor: "#000000",
    borderColor: "#475569",
    textColor: "#ffffff",
    descriptionColor: "#e2e8f0",
    booleanHeaderColor: "#991b1b",
  },
];

export const DEFAULT_PALETTE_ID = "grey";

export function getPalette(paletteId: string): ColorPalette {
  return COLOR_PALETTES.find((p) => p.id === paletteId) ?? COLOR_PALETTES[0];
}

export const NODE_TYPE_DEFINITIONS: NodeTypeDefinition[] = [
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
    boxTitle: isComplex ? "Box Title" : undefined,
    nodeType: type,
    description: "",
    color: palette.bodyColor,
    headerColor: type === "and" || type === "or" ? palette.booleanHeaderColor : palette.headerColor,
    textColor: palette.textColor,
    descriptionColor: palette.descriptionColor,
    fontSize: isSmall ? 18 : isPill ? 13 : isComplex ? 15 : isCircle || isHexagon ? 14 : 14,
    borderColor: palette.borderColor,
    borderStyle: "solid",
    borderWidth: 0,
    width: isSmall ? 100 : isPill ? 180 : isComplex ? 280 : isCircle ? 120 : isHexagon ? 120 : 180,
    height: isSmall ? 60 : isPill ? 60 : isComplex ? 140 : isCircle ? 120 : isHexagon ? 100 : 80,
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

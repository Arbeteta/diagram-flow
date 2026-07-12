let counter = 0;

export function generateId(): string {
  counter += 1;
  return `${Date.now()}-${counter}`;
}

export function generateNodeId(): string {
  return `node_${generateId()}`;
}

export function generateEdgeId(source: string, target: string): string {
  return `edge_${source}_${target}_${generateId()}`;
}

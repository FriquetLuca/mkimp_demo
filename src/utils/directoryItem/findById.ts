import type { DirectoryItem } from "../../types/fileExplorer";

export function findById(id: string, node: DirectoryItem): DirectoryItem | null {
  if (node.id === id) return node;

  if ('nodes' in node) {
    for (const child of node.nodes) {
      const result = findById(id, child);
      if (result) return result;
    }
  }

  return null;
}

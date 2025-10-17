import type { DirectoryItem } from '../../types/fileExplorer';

export function findByIds(ids: string[], node: DirectoryItem): DirectoryItem[] {
  const result: DirectoryItem[] = [];
  if (ids.includes(node.id)) {
    result.push(node);
  }
  if ('nodes' in node) {
    for (const child of node.nodes) {
      const found = findByIds(ids, child);
      if (found) result.push(...found);
    }
  }

  return result;
}

import type { DirectoryEntry, DirectoryItem } from '../../types/fileExplorer';
import { isDirectory } from './isDirectory';

export function findParent(
  childId: string,
  node: DirectoryItem
): DirectoryEntry | null {
  if (!isDirectory(node)) return null;

  for (const child of node.nodes) {
    if (child.id === childId) return node;
    const found = findParent(childId, child);
    if (found) return found;
  }

  return null;
}

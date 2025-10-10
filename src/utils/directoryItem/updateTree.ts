import type { DirectoryItem, FileEntry } from '../../types/fileExplorer';

export function updateTree(
  updated: FileEntry,
  items: DirectoryItem[]
): DirectoryItem[] {
  return items.map((item) => {
    if ('nodes' in item) {
      return { ...item, nodes: updateTree(updated, item.nodes) };
    } else if (item.id === updated.id) {
      return updated;
    }
    return item;
  });
}

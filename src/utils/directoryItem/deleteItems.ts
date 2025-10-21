import type { DirectoryItem } from '../../types/fileExplorer';
import { deepClone } from '../deepClone';
import { isDirectory } from './isDirectory';

function deleteItems(targetIds: string[], allItems: DirectoryItem[]) {
  const nodes = allItems.filter((item) => !targetIds.includes(item.id));
  nodes.forEach((node) => {
    if (isDirectory(node)) {
      node.nodes = deleteItems(targetIds, node.nodes);
    }
  });
  return nodes;
}

export function deleteDirectoryItems(
  targetIds: string[],
  allItems: DirectoryItem[]
) {
  const nodes = deepClone(allItems);
  return deleteItems(targetIds, nodes);
}

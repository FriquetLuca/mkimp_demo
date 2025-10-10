import type { DirectoryItem } from '../../types/fileExplorer';
import { isDirectory } from './isDirectory';

export function regenerateIds(item: DirectoryItem) {
  item.id = crypto.randomUUID();
  if (isDirectory(item)) {
    item.nodes.forEach((node) => regenerateIds(node));
  }
  return item;
}

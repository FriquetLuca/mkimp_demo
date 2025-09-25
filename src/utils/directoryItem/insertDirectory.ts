import type { DirectoryEntry, DirectoryItem } from '../../types/fileExplorer';
import { isDirectory } from './isDirectory';

export function insertDirectory(
  path: string,
  target: DirectoryItem
): DirectoryEntry {
  if (!isDirectory(target)) throw new Error('Target must be a directory');

  const segments = path.split('/').filter(Boolean);
  let current = target;

  for (const segment of segments) {
    let next = current.nodes.find(
      (n) => isDirectory(n) && n.name === segment
    ) as DirectoryEntry | undefined;

    if (!next) {
      next = {
        id: crypto.randomUUID(),
        name: segment,
        nodes: [],
      };
      current.nodes.push(next);
    }

    current = next;
  }

  return current;
}

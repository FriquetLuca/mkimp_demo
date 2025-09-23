import { type DirectoryItem, type FileEntry } from '../data/files';
import { allItems } from '../data/files';

/**
 * Recursively find a file by absolute path like "/src/app.tsx"
 */
export function findFile(path: string, items: DirectoryItem[] = allItems): FileEntry | null {
  const parts = path.split('/').filter(Boolean); // remove leading/trailing slashes

  let currentItems: DirectoryItem[] = items;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const match = currentItems.find((item) => item.name === part);

    if (!match) return null;

    const isLast = i === parts.length - 1;

    if ('nodes' in match) {
      // It's a folder
      currentItems = match.nodes;
    } else if (isLast) {
      // It's a file and it's the last part
      return match;
    } else {
      // It's a file but not the last part — invalid
      return null;
    }
  }

  return null;
}

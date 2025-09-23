import { type DirectoryItem } from '../data/files';

/**
 * Sorts DirectoryItems:
 * - Directories first
 * - Alphabetically by name
 * - Recursively sorts nested folders
 */
export function sortDirectoryItems(items: DirectoryItem[]): DirectoryItem[] {
  return items
    .map(item => {
      // Recursively sort children if it's a directory
      if ('nodes' in item) {
        return {
          ...item,
          nodes: sortDirectoryItems(item.nodes),
        };
      }
      return item;
    })
    .sort((a, b) => {
      const aIsDir = 'nodes' in a;
      const bIsDir = 'nodes' in b;

      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;

      return a.name.localeCompare(b.name);
    });
}

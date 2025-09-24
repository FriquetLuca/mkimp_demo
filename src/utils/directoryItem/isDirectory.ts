import type { DirectoryEntry, DirectoryItem } from "../../types/fileExplorer";

export function isDirectory(item: DirectoryItem): item is DirectoryEntry {
  return 'nodes' in item;
}

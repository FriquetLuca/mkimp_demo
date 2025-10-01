export interface FileEntry {
  id: string;
  name: string;
  content: string;
}

export interface DirectoryEntry {
  id: string;
  name: string;
  nodes: DirectoryItem[];
}

export type DirectoryItem = DirectoryEntry | FileEntry;

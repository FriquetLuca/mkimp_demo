export type FileEntry = {
  id: string;
  name: string;
  content: string;
};

export type DirectoryEntry = {
  id: string;
  name: string;
  nodes: DirectoryItem[];
};

export type DirectoryItem = DirectoryEntry | FileEntry;

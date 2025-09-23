export type FileEntry = {
  id: string;
  name: string;
  content: string;
};

export const files: FileEntry[] = [
  { id: '1', name: 'index.html', content: '<h1>Hello World</h1>' },
  { id: '2', name: 'app.tsx', content: 'console.log("App file");' },
  { id: '3', name: 'style.css', content: 'body { margin: 0; }' },
];


export type DirectoryEntry = {
  id: string;
  name: string;
  nodes: DirectoryItem[];
};

export type DirectoryItem = DirectoryEntry | FileEntry;

export const allItems: DirectoryItem[] = [
  { id: '1', name: 'index.html', content: '<h1>Hello World</h1>' },
  { id: '2', name: 'src', nodes: [
      { id: '3', name: 'app.tsx', content: 'console.log("App file");' },
      { id: '4', name: 'assets', nodes: [
          { id: '5', name: 'dunno.txt', content: 'Hello World' },
        ] 
      },
    ] 
  },
];

import type { DirectoryItem } from "../components/FileExplorer";

export const allItems: DirectoryItem[] = [
  { id: '1', name: 'index.html', content: '<h1>Hello World</h1>' },
  { id: '2', name: 'src', nodes: [
      { id: '3', name: 'app.tsx', content: 'console.log("App file");' },
      { id: '4', name: 'assets', nodes: [
          { id: '5', name: 'dunno.txt', content: 'Hello World' },
          { id: '6', name: 'other', nodes: [
              { id: '7', name: 'file.txt', content: 'World' },
            ] 
          },
        ] 
      },
    ] 
  },
];

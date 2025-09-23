import { useEffect, useRef, useState } from 'react'
import { allItems, type DirectoryItem, type FileEntry } from './data/files';
import FileExplorer from './components/FileExplorer';
import EditorView from './components/EditorView';
// import reactLogo from './assets/react.svg' // <img src={reactLogo} className="logo react" alt="React logo" />
// import viteLogo from '/vite.svg' // <img src={viteLogo} className="logo" alt="Vite logo" />
import './App.css'
import { sortDirectoryItems } from './utils/sortDirectoryItems';

function App() {
  const [filesTree, setFilesTree] = useState<DirectoryItem[]>(sortDirectoryItems(allItems));
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(240);

  const isResizing = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Flatten file lookup (for content editing)
  const flattenFiles = (items: DirectoryItem[]): FileEntry[] => {
    return items.flatMap((item) => {
      if ('nodes' in item) return flattenFiles(item.nodes);
      return [item];
    });
  };

  const allFiles = flattenFiles(filesTree);
  const selectedFile = allFiles.find((f) => f.id === selectedFileId) ?? null;

  const updateFile = (updated: FileEntry) => {
    const updateTree = (items: DirectoryItem[]): DirectoryItem[] =>
      items.map((item) => {
        if ('nodes' in item) {
          return { ...item, nodes: updateTree(item.nodes) };
        } else if (item.id === updated.id) {
          return updated;
        }
        return item;
      });

    setFilesTree(sortDirectoryItems(updateTree(filesTree)));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !containerRef.current) return;

      const containerLeft = containerRef.current.getBoundingClientRect().left;
      const newWidth = e.clientX - containerLeft;
      setSidebarWidth(Math.max(150, Math.min(newWidth, 500)));
    };

    const handleMouseUp = () => {
      isResizing.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: sidebarWidth,
          borderRight: '1px solid #333',
          backgroundColor: '#393939',
        }}
      >
        <FileExplorer
          items={filesTree}
          selectedFileId={selectedFileId}
          onSelect={(file) => setSelectedFileId(file.id)}
        />
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={() => {
          isResizing.current = true;
        }}
        style={{
          width: '1px',
          cursor: 'col-resize',
          backgroundColor: '#555',
          zIndex: 100,
        }}
      />

      {/* Editor area */}
      <div style={{ flexGrow: 1, overflow: 'auto' }}>
        <EditorView file={selectedFile} onChange={updateFile} />
      </div>
    </div>
  );
}

export default App

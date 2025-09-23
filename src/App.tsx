import { useEffect, useRef, useState } from 'react'
import { allItems } from './data/files';
import { moveItem, type DirectoryItem, type FileEntry } from './components/FileExplorer';
import EditorView from './components/EditorView';
// import reactLogo from './assets/react.svg' // <img src={reactLogo} className="logo react" alt="React logo" />
// import viteLogo from '/vite.svg' // <img src={viteLogo} className="logo" alt="Vite logo" />
import './App.css'
import { sortDirectoryItems } from './utils/sortDirectoryItems';
import Sidebar from './components/Sidebar';
import SidebarSeparator from './components/SidebarSeparator';

function App() {
  const [filesTree, setFilesTree] = useState<DirectoryItem[]>(sortDirectoryItems(allItems));
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const setItems = (items: DirectoryItem[]) => setFilesTree(sortDirectoryItems(items));
  const onSelect = (file: FileEntry) => setSelectedFileId(file.id);


  const [sidebarWidth, setSidebarWidth] = useState(240);
  const isResizing = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = (itemId: string, targetDirId: string) => {
    setFilesTree((prevItems) => sortDirectoryItems(moveItem(prevItems, itemId, targetDirId)));
  };

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

  // Flatten file lookup (for content editing)
  const flattenFiles = (items: DirectoryItem[]): FileEntry[] => {
    return items.flatMap((item) => {
      if ('nodes' in item) return flattenFiles(item.nodes);
      return [item];
    });
  };

  const allFiles = flattenFiles(filesTree);
  const selectedFile = allFiles.find((f) => f.id === selectedFileId) ?? null;

  useEffect(() => {
    const handleMouseUp = () => {
      document.body.style.userSelect = '';
      isResizing.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !containerRef.current) return;

      if ((e.buttons & 1) !== 1) {
        handleMouseUp();
        return;
      }

      document.body.style.userSelect = 'none';

      const containerLeft = containerRef.current.getBoundingClientRect().left;
      const newWidth = e.clientX - containerLeft;
      setSidebarWidth(Math.max(150, Math.min(newWidth, 500)));
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
      <Sidebar
        sidebarWidth={sidebarWidth}
        items={filesTree}
        selectedFileId={selectedFileId}
        handleMove={handleMove}
        setItems={setItems}
        onSelect={onSelect}
      />
      <SidebarSeparator
        onMouseDown={() => {
          isResizing.current = true;
        }}
      />
      <div style={{ width: '100%', overflowX: 'hidden', overflowY: 'auto' }}>
        <EditorView file={selectedFile} onChange={updateFile} />
      </div>
    </div>
  );
}

export default App

import { useState } from 'react';
import { allItems } from './data/files';
import { moveItem, type DirectoryItem, type FileEntry } from './components/FileExplorer';
import EditorView from './components/EditorView';
import './App.css';
import { sortDirectoryItems } from './utils/sortDirectoryItems';
import Sidebar from './components/Sidebar';
import SidebarSeparator from './components/SidebarSeparator';
import { useResizableSidebarH } from './hooks/useResizableSidebar';

function App() {
  const [filesTree, setFilesTree] = useState<DirectoryItem[]>(sortDirectoryItems(allItems));
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const setItems = (items: DirectoryItem[]) => setFilesTree(sortDirectoryItems(items));
  const onSelect = (file: FileEntry) => setSelectedFileId(file.id);

  const {
    sidebarWidth,
    sidebarRef,
    containerRef,
    onSeparatorMouseDown,
  } = useResizableSidebarH({
    maxWidth: 300,
  });

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

  const flattenFiles = (items: DirectoryItem[]): FileEntry[] => {
    return items.flatMap((item) => {
      if ('nodes' in item) return flattenFiles(item.nodes);
      return [item];
    });
  };

  const allFiles = flattenFiles(filesTree);
  const selectedFile = allFiles.find((f) => f.id === selectedFileId) ?? null;

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
      <div
        ref={sidebarRef}
        style={{
          width: `${sidebarWidth}px`,
          minWidth: '150px',
          maxWidth: '500px',
          flexShrink: 0,
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
      </div>

      <SidebarSeparator onMouseDown={onSeparatorMouseDown} />

      <div style={{ width: '100%', overflowX: 'hidden', overflowY: 'auto' }}>
        <EditorView file={selectedFile} onChange={updateFile} />
      </div>
    </div>
  );
}

export default App;

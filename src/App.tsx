import { useState } from 'react';
import { allItems } from './data/files';
import EditorView from './components/EditorView';
import './App.css';
import Sidebar from './components/Sidebar';
import { useResizableSidebar } from './hooks/useResizableSidebar';
import type { DirectoryItem, FileEntry } from './types/fileExplorer';
import { moveDirectoryItem, sortDirectoryItems } from './utils/directoryItem';
import { ModalProvider } from './provider/ModalProvider';

function App() {
  const [filesTree, setFilesTree] = useState<DirectoryItem[]>(
    sortDirectoryItems(allItems)
  );
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [openedFileId, setOpenedFileId] = useState<string | null>(null);

  const setItems = (items: DirectoryItem[]) =>
    setFilesTree(sortDirectoryItems(items));
  const onSelect = (file: FileEntry) => {
    if (selectedFileId !== file.id) {
      setSelectedFileId(file.id);
    }
  };
  const onOpen = (file: FileEntry) => {
    if (openedFileId !== file.id) {
      setOpenedFileId(file.id);
    }
  };

  const { sidebarWidth, sidebarRef, containerRef, onSeparatorMouseDown } =
    useResizableSidebar({
      mode: 'calc',
      maxWidth: 250,
    });

  const handleMove = (itemId: string, targetDirId: string) => {
    const result = moveDirectoryItem(itemId, targetDirId, filesTree);
    if (result.success) {
      setItems(result.value);
    } else {
      alert(result.error);
    }
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
    setItems(updateTree(filesTree));
  };

  const flattenFiles = (items: DirectoryItem[]): FileEntry[] => {
    return items.flatMap((item) => {
      if ('nodes' in item) return flattenFiles(item.nodes);
      return [item];
    });
  };

  const allFiles = flattenFiles(filesTree);
  const selectedFile = allFiles.find((f) => f.id === openedFileId) ?? null;

  return (
    <ModalProvider>
      <div
        ref={containerRef}
        className="flex h-screen w-screen overflow-hidden"
      >
        <Sidebar
          sidebarWidth={sidebarWidth}
          sidebarRef={sidebarRef}
          items={filesTree}
          selectedFileId={selectedFileId}
          handleMove={handleMove}
          setItems={setItems}
          onSelect={onSelect}
          onOpen={onOpen}
          onSeparatorMouseDown={onSeparatorMouseDown}
        />
        <div className="w-full overflow-x-hidden overflow-y-hidden">
          <EditorView file={selectedFile} onChange={updateFile} />
        </div>
      </div>
    </ModalProvider>
  );
}

export default App;

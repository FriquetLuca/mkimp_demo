import { useState } from 'react';
import { allItems } from './data/files';
import EditorView from './components/EditorView';
import './App.css';
import Sidebar from './components/Sidebar';
import SidebarSeparator from './components/SidebarSeparator';
import { useResizableSidebarH } from './hooks/useResizableSidebar';
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
    useResizableSidebarH({
      maxWidth: 300,
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
        <div
          ref={sidebarRef}
          className="min-w-[150px] max-w-[500px] flex-shrink-0 overflow-hidden"
          style={{
            width: `${sidebarWidth}px`,
          }}
        >
          <Sidebar
            sidebarWidth={sidebarWidth}
            items={filesTree}
            selectedFileId={selectedFileId}
            handleMove={handleMove}
            setItems={setItems}
            onSelect={onSelect}
            onOpen={onOpen}
          />
        </div>

        <SidebarSeparator onMouseDown={onSeparatorMouseDown} />

        <div className="w-full overflow-x-hidden overflow-y-hidden">
          <EditorView file={selectedFile} onChange={updateFile} />
        </div>
      </div>
    </ModalProvider>
  );
}

export default App;

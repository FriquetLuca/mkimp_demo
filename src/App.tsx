import { useState } from 'react';
import { allItems } from './data/files';
import EditorView from './components/EditorView';
import './App.css';
import Sidebar from './components/Sidebar';
import { useResizableSidebar } from './hooks/useResizableSidebar';
import type { DirectoryItem, FileEntry } from './types/fileExplorer';
import { moveDirectoryItem, sortDirectoryItems } from './utils/directoryItem';
import { ModalProvider } from './provider/ModalProvider';
import Tabs from './components/Tabs';

function App() {
  const [filesTree, setFilesTree] = useState<DirectoryItem[]>(
    sortDirectoryItems(allItems)
  );
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [openedFileId, setOpenedFileId] = useState<string | null>(null);
  const [openedFiles, setOpenedFiles] = useState<FileEntry[]>([]);

  const setItems = (items: DirectoryItem[]) =>
    setFilesTree(sortDirectoryItems(items));

  const onSelect = (file: FileEntry) => {
    if (selectedFileId !== file.id) {
      setSelectedFileId(file.id);
    }
  };

  const onOpen = (file: FileEntry) => {
    setOpenedFileId(file.id);
    setSelectedFileId(file.id);
    setOpenedFiles((prev) => {
      if (prev.find((f) => f.id === file.id)) return prev;
      return [...prev, file];
    });
  };

  const sidebarProps = useResizableSidebar({
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

    // Update the file in openedFiles too
    setOpenedFiles((prev) =>
      prev.map((f) => (f.id === updated.id ? updated : f))
    );
  };

  const handleCloseTab = (file: FileEntry) => {
    setOpenedFiles((prev) => prev.filter((f) => f.id !== file.id));

    // If the closed tab is the active one, switch to another or null
    if (openedFileId === file.id) {
      const remaining = openedFiles.filter((f) => f.id !== file.id);
      setOpenedFileId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  return (
    <ModalProvider>
      <Sidebar
        items={filesTree}
        selectedFileId={selectedFileId}
        handleMove={handleMove}
        setItems={setItems}
        onSelect={onSelect}
        onOpen={onOpen}
        {...sidebarProps}
      >
        <div className="w-full h-full overflow-hidden flex flex-col flex-1 font-mono text-sm">
          <Tabs<FileEntry>
            items={openedFiles}
            activeTabId={openedFileId}
            setActiveTabId={setOpenedFileId}
            setItems={setOpenedFiles}
            getName={(item) => item.name}
            getContent={(item) =>
              item ? <EditorView file={item} onChange={updateFile} /> : null
            }
            onClose={handleCloseTab}
          />
        </div>
      </Sidebar>
    </ModalProvider>
  );
}

export default App;

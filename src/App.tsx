import { useState } from 'react';
import EditorView from './components/EditorView';
import Sidebar from './components/Sidebar';
import { useResizableSidebar } from './hooks/useResizableSidebar';
import type { DirectoryItem, FileEntry } from './types/fileExplorer';
import { moveDirectoryItem, sortDirectoryItems } from './utils/directoryItem';
import { ModalProvider } from './provider/ModalProvider';
import Tabs from './components/Tabs';
import EditorLayout from './components/EditorLayout';
import HtmlRenderer from './components/HtmlRenderer';

export default function App() {
  const [filesTree, setFilesTree] = useState<DirectoryItem[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [openedFileId, setOpenedFileId] = useState<string | null>(null);
  const [openedFiles, setOpenedFiles] = useState<FileEntry[]>([]);
  const [isSidebarVisible, setSidebarVisible] = useState(false);

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

  const editorSidebarProps = useResizableSidebar();

  const sidebarProps = useResizableSidebar({
    mode: 'calc',
    direction: 'right',
    minWidth: 50,
    maxWidth: 200,
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
      <EditorLayout
        items={filesTree}
        selectedFileId={selectedFileId}
        onMove={handleMove}
        setItems={setItems}
        onSelect={onSelect}
        onOpen={onOpen}
        {...editorSidebarProps}
      >
        <div className="w-full h-full overflow-hidden flex flex-col flex-1 font-mono text-sm">
          <Tabs<FileEntry>
            items={openedFiles}
            activeTabId={openedFileId}
            setActiveTabId={setOpenedFileId}
            setItems={setOpenedFiles}
            getName={(item) => item.name}
            tabMenu={() => (
              <div className="px-1 flex items-center h-full gap-1">
                <button
                  className="px-1 py-1 bg-transparent border-none rounded-md cursor-pointer text-[14px] leading-none hover:bg-gray-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSidebarVisible(!isSidebarVisible);
                  }}
                >
                  {isSidebarVisible ? (
                    <img src="/preview_off.svg" alt="preview" />
                  ) : (
                    <img src="/preview.svg" alt="preview" />
                  )}
                </button>
              </div>
            )}
            getContent={(item) => {
              if (isSidebarVisible) {
                return (
                  <Sidebar
                    {...sidebarProps}
                    direction="right"
                    size="full"
                    sidebarContent={
                      <HtmlRenderer
                        className="border-t border-[var(--md-cspan-bg-color)]"
                        title={item?.name ?? 'Undefined'}
                        htmlcontent={''}
                      />
                    }
                  >
                    <EditorView file={item ?? null} onChange={updateFile} />
                  </Sidebar>
                );
              }
              return <EditorView file={item ?? null} onChange={updateFile} />;
            }}
            onClose={handleCloseTab}
          />
        </div>
      </EditorLayout>
    </ModalProvider>
  );
}

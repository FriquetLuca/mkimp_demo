import { useEffect, useState } from 'react';
import EditorView from './components/EditorView';
import Sidebar from './components/Sidebar';
import { useResizableSidebar } from './hooks/useResizableSidebar';
import type { FileEntry } from './types/fileExplorer';
import {
  isDirectory,
  moveDirectoryItem,
  updateTree,
} from './utils/directoryItem';
import { ModalProvider } from './provider/ModalProvider';
import Tabs from './components/Tabs';
import EditorLayout from './components/EditorLayout';
import HtmlRenderer from './components/HtmlRenderer';
import Image from './components/Image';
import { parse } from './utils/markdown';
import { usePersistentFilesTree } from './hooks/useFileTree';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { filesTree, setItems, loading } = usePersistentFilesTree();
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [openedFileId, setOpenedFileId] = useState<string | null>(null);
  const [openedFiles, setOpenedFiles] = useState<FileEntry[]>([]);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [htmlPreviews, setHtmlPreviews] = useState<Record<string, string>>({});
  const { t } = useTranslation();

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
    setItems(updateTree(updated, filesTree));

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

  useEffect(() => {
    const parseHtmlForOpenedFiles = async () => {
      for (const file of openedFiles) {
        if (openedFileId === file.id && file.name.endsWith('.md')) {
          const html = await parse(file, filesTree);
          if (!htmlPreviews[file.id] || htmlPreviews[file.id] !== html) {
            setHtmlPreviews((prev) => ({ ...prev, [file.id]: html }));
          }
        }
      }
    };
    parseHtmlForOpenedFiles();
  }, [openedFiles, filesTree]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center gap-2">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
        <p>{t('loadingWorkspace')}</p>
      </div>
    );
  }

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
            tabMenu={(item) => {
              const downloadHtml = async (e: React.MouseEvent) => {
                if (!item || isDirectory(item)) return;

                const html = item.name.endsWith('.md')
                  ? await parse(item, filesTree, true)
                  : null;
                if (html === null) return;
                e.stopPropagation();

                const blob = new Blob([html], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = item.name.replace(/\.(md|html)$/, '.html');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              };

              const download = async (e: React.MouseEvent) => {
                if (!item || isDirectory(item)) return;

                e.stopPropagation();
                const blob = new Blob([item.content], { type: 'text/text' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = item.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              };
              if (
                item &&
                (item.name.endsWith('.md') || item.name.endsWith('.html'))
              ) {
                const preview =
                  item.name.endsWith('.md') || item.name.endsWith('.html') ? (
                    <button
                      className="px-1 py-1 bg-transparent border-none rounded-md cursor-pointer text-[14px] leading-none hover:bg-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSidebarVisible(!isSidebarVisible);
                      }}
                      title={t(
                        isSidebarVisible ? 'tabs.preview_off' : 'tabs.preview'
                      )}
                    >
                      {isSidebarVisible ? (
                        <Image src="/preview_off.svg" alt="preview off" />
                      ) : (
                        <Image src="/preview.svg" alt="preview" />
                      )}
                    </button>
                  ) : undefined;
                const download_html = item.name.endsWith('.md') ? (
                  <button
                    className="px-1 py-1 bg-transparent border-none rounded-md cursor-pointer text-[14px] leading-none hover:bg-gray-800"
                    onClick={downloadHtml}
                    title={t('tabs.download_html')}
                  >
                    <Image
                      className="h-5 w-5"
                      src="/html_document.svg"
                      alt="Download HTML"
                    />
                  </button>
                ) : undefined;

                return (
                  <div className="px-1 flex items-center h-full gap-1">
                    {preview}
                    {download_html}
                    <button
                      className="px-1 py-1 bg-transparent border-none rounded-md cursor-pointer text-[14px] leading-none hover:bg-gray-800"
                      onClick={download}
                      title={t('tabs.download')}
                    >
                      <Image src="/download.svg" alt="Download" />
                    </button>
                  </div>
                );
              }
              return <div className="px-1 flex items-center h-full gap-1" />;
            }}
            getContent={(item) => {
              if (item) {
                const html = item.name.endsWith('.md')
                  ? (htmlPreviews[item.id] ?? '')
                  : item.name.endsWith('.html')
                    ? item.content
                    : null;
                if (html && isSidebarVisible) {
                  return (
                    <Sidebar
                      {...sidebarProps}
                      direction="right"
                      size="full"
                      sidebarContent={
                        <HtmlRenderer
                          className="absolute w-full h-full border-t border-[var(--md-cspan-bg-color)]"
                          title={item?.name ?? 'Undefined'}
                          srcDoc={html}
                          disabled={sidebarProps.isDragging}
                        />
                      }
                    >
                      <EditorView file={item ?? null} onChange={updateFile} />
                    </Sidebar>
                  );
                }
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

import { useTranslation } from 'react-i18next';
import type { DirectoryItem, FileEntry } from '../../types/fileExplorer';
import { DirectoryList } from './DirectoryList';
import { useModal } from '../../hooks/useModal';
import { CreateFileModal, CreateFolderModal } from '../ContextMenuModals';
import { downloadBlob, downloadFile } from '../../utils/downloadFile';
import ExportIcon from '@icons/export.svg?react';
import ImportIcon from '@icons/import.svg?react';
import NewFileIcon from '@icons/new_file.svg?react';
import NewFolderIcon from '@icons/new_folder.svg?react';
import DownloadIcon from '@icons/download.svg?react';
import { DirectoryItemArraySchema } from '../../schemas/directoryItemSchema';
import { useRef } from 'react';
import { importDirectory, toZip } from '../../utils/directoryItem';
import JSZip from 'jszip';

interface FileExplorerProps {
  items: DirectoryItem[];
  setItems: (newItems: DirectoryItem[]) => void;
  selectedFileIds: string[];
  onOpen: (file: FileEntry) => void;
  onSelect: (item: DirectoryItem, add?: boolean) => void;
  onMove: (itemId: string, targetDirId: string) => void;
}

export default function FileExplorer({
  items,
  setItems,
  selectedFileIds,
  onSelect,
  onOpen,
  onMove,
}: FileExplorerProps) {
  const { t } = useTranslation();
  const { open, close } = useModal();
  const inputRef = useRef<HTMLInputElement>(null);
  const tabsWrapperRef = useRef<HTMLDivElement>(null);

  const newFileItem = () => {
    open(
      <CreateFileModal
        items={items}
        targetId={'root'}
        onCreate={(items) => {
          setItems(items);
          close();
        }}
        onCancel={close}
      />,
      { containerOnly: false, static: true }
    );
  };

  const newDirectoryItem = () => {
    open(
      <CreateFolderModal
        items={items}
        targetId={'root'}
        onCreate={(items) => {
          setItems(items);
          close();
        }}
        onCancel={close}
      />,
      { containerOnly: false, static: true }
    );
  };

  const download = async (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadFile('project.json', [JSON.stringify(items)]);
  };

  const downloadDirectoryAsZip = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const zip = new JSZip();
    toZip(zip, items);

    const blob = await zip.generateAsync({ type: 'blob' });

    downloadBlob('export.zip', blob);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const parsed = DirectoryItemArraySchema.parse(json);
      const newItems = importDirectory(items, parsed);
      setItems(newItems);
    } catch (_) {
      open(
        <div className="p-4 pt-2 flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <span className="text-[0.9rem]">⚠️</span>
            <pre className="inline-block whitespace-pre-wrap text-[0.9rem] text-[color-mix(in_srgb,_red_70%,_black_30%)]">
              {t('sidebar.fileExplorer.invalidJSON')}
            </pre>
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={close}
              className="px-[1.2rem] py-2.5 border-transparent rounded-[10px] confirm-btn"
            >
              {t('sidebar.fileExplorer.close')}
            </button>
          </div>
        </div>
      );
    } finally {
      event.target.value = '';
    }
  };

  const triggerUpload = () => {
    inputRef.current?.click();
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (tabsWrapperRef.current) {
      // Only handle horizontal scroll if available
      tabsWrapperRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="w-full flex flex-col h-full bg-[var(--md-table-nth-child-bg-color)]">
      <div className="flex justify-between items-center border-b border-[#333]">
        <h3 className="p-[4px]">{t('sidebar.fileExplorer.label')}</h3>
        <div
          className="overflow-x-auto p-1 select-none flex gap-0.5 border-l border-[#333] scrollbar-hide"
          ref={tabsWrapperRef}
          onWheel={handleWheel}
        >
          <button
            className="px-1 py-1 bg-transparent border-none rounded-md cursor-pointer text-[14px] leading-none hover:bg-gray-800"
            onClick={newFileItem}
            title={t('sidebar.fileExplorer.newFile')}
          >
            <NewFileIcon className="w-6 h-6 fill-gray-300" />
          </button>
          <button
            className="px-1 py-1 bg-transparent border-none rounded-md cursor-pointer text-[14px] leading-none hover:bg-gray-800"
            onClick={newDirectoryItem}
            title={t('sidebar.fileExplorer.newFolder')}
          >
            <NewFolderIcon className="w-6 h-6 fill-gray-300" />
          </button>
          <button
            className="px-1 py-1 bg-transparent border-none rounded-md cursor-pointer text-[14px] leading-none hover:bg-gray-800"
            onClick={downloadDirectoryAsZip}
            title={t('sidebar.fileExplorer.download')}
          >
            <DownloadIcon className="w-6 h-6 fill-gray-300" />
          </button>
          <button
            className="px-1 py-1 bg-transparent border-none rounded-md cursor-pointer text-[14px] leading-none hover:bg-gray-800"
            onClick={triggerUpload}
            title={t('sidebar.fileExplorer.import')}
          >
            <ImportIcon className="w-6 h-6 fill-gray-300" />
          </button>
          <input
            type="file"
            accept=".json"
            ref={inputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            className="px-1 py-1 bg-transparent border-none rounded-md cursor-pointer text-[14px] leading-none hover:bg-gray-800"
            onClick={download}
            disabled={items.length === 0}
            title={t('sidebar.fileExplorer.export')}
          >
            <ExportIcon
              className={`w-6 h-6 ${items.length === 0 ? 'fill-gray-500' : 'fill-gray-300'}`}
            />
          </button>
        </div>
      </div>

      <div className="w-full relative flex-1 min-h-0 flex flex-col overflow-y-auto scrollbar-thin">
        <DirectoryList
          items={items}
          selectedFileIds={selectedFileIds}
          onSelect={onSelect}
          onOpen={onOpen}
          onMove={onMove}
          depth={0}
          className="overflow-y-auto m-0 p-0"
        />
      </div>
    </div>
  );
}

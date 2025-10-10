import { useTranslation } from 'react-i18next';
import type { DirectoryItem, FileEntry } from '../../types/fileExplorer';
import { DirectoryList } from './DirectoryList';
import { useModal } from '../../hooks/useModal';
import { CreateFileModal, CreateFolderModal } from '../ContextMenuModals';
import { downloadFile } from '../../utils/downloadFile';
import ExportIcon from '@icons/export.svg?react';
import ImportIcon from '@icons/import.svg?react';
import NewFileIcon from '@icons/new_file.svg?react';
import NewFolderIcon from '@icons/new_folder.svg?react';

interface FileExplorerProps {
  items: DirectoryItem[];
  setItems: (newItems: DirectoryItem[]) => void;
  selectedFileIds: Array<string>;
  onOpen: (file: FileEntry) => void;
  onSelect: (file: FileEntry, add?: boolean) => void;
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

  return (
    <div className="w-full flex flex-col h-full bg-[var(--md-table-nth-child-bg-color)]">
      <div className="flex justify-between items-center">
        <h3 className="p-[4px]">{t('sidebar.fileExplorer.label')}</h3>
        <div className="p-1 select-none flex gap-0.5">
          <button
            className="px-1 py-1 bg-transparent border-none rounded-md cursor-pointer text-[14px] leading-none hover:bg-gray-800"
            disabled={true}
            title={t('sidebar.fileExplorer.import')}
          >
            <ImportIcon
              className={`w-6 h-6 ${true ? 'fill-gray-500' : 'fill-gray-300'}`}
            />
          </button>
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

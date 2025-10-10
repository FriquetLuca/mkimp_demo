import { useTranslation } from 'react-i18next';
import type { DirectoryItem, FileEntry } from '../../types/fileExplorer';
import { DirectoryList } from './DirectoryList';
import { useModal } from '../../hooks/useModal';
import { CreateFileModal, CreateFolderModal } from '../ContextMenuModals';
import Image from '../Image';

interface FileExplorerProps {
  items: DirectoryItem[];
  setItems: (newItems: DirectoryItem[]) => void;
  selectedFileId: string | null;
  onOpen: (file: FileEntry) => void;
  onSelect: (file: FileEntry) => void;
  onMove: (itemId: string, targetDirId: string) => void;
}

export default function FileExplorer({
  items,
  setItems,
  selectedFileId,
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
  return (
    <div className="w-full flex flex-col h-full bg-[var(--md-table-nth-child-bg-color)]">
      <div className="flex justify-between items-center">
        <h3 className="p-[4px]">{t('sidebar.fileExplorer.label')}</h3>
        <div className="flex gap-0.5">
          <button
            className="px-1 py-1 bg-transparent border-none rounded-md cursor-pointer text-[14px] leading-none hover:bg-gray-800"
            onClick={newFileItem}
          >
            <Image src="/new_file.svg" alt="new file" />
          </button>
          <button
            className="px-1 py-1 bg-transparent border-none rounded-md cursor-pointer text-[14px] leading-none hover:bg-gray-800"
            onClick={newDirectoryItem}
          >
            <Image src="/new_folder.svg" alt="new folder" />
          </button>
        </div>
      </div>

      <div className="w-full relative flex-1 min-h-0 flex flex-col overflow-y-auto scrollbar-thin">
        <DirectoryList
          items={items}
          selectedFileId={selectedFileId}
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

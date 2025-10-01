import { useTranslation } from 'react-i18next';
import type { DirectoryItem, FileEntry } from '../../types/fileExplorer';
import { DirectoryList } from './DirectoryList';

interface FileExplorerProps {
  items: DirectoryItem[];
  selectedFileId: string | null;
  onOpen: (file: FileEntry) => void;
  onSelect: (file: FileEntry) => void;
  onMove: (itemId: string, targetDirId: string) => void;
}

export default function FileExplorer({
  items,
  selectedFileId,
  onSelect,
  onOpen,
  onMove,
}: FileExplorerProps) {
  const { t } = useTranslation();
  return (
    <div className="w-full flex flex-col h-full bg-[var(--md-table-nth-child-bg-color)]">
      <h3 className="p-[4px]">{t('sidebar.fileExplorer.label')}</h3>
      <div className="w-full relative flex-1 min-h-0 overflow-y-auto scrollbar-thin">
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

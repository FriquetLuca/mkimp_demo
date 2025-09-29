import { useTranslation } from 'react-i18next';
import type { DirectoryItem, FileEntry } from '../../types/fileExplorer';
import { DirectoryList } from './DirectoryList';

type Props = {
  items: DirectoryItem[];
  selectedFileId: string | null;
  onOpen: (file: FileEntry) => void;
  onSelect: (file: FileEntry) => void;
  onMove: (itemId: string, targetDirId: string) => void;
};

export default function FileExplorer({
  items,
  selectedFileId,
  onSelect,
  onOpen,
  onMove,
}: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col h-full">
      <h3 className="p-[4px]">{t('sidebar.fileExplorer.label')}</h3>
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
  );
}

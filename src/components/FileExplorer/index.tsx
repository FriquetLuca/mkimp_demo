import type { DirectoryItem, FileEntry } from '../../types/fileExplorer';
import { DirectoryList } from './DirectoryList';

type Props = {
  items: DirectoryItem[];
  selectedFileId: string | null;
  onSelect: (file: FileEntry) => void;
  onMove: (itemId: string, targetDirId: string) => void;
};

export default function FileExplorer({ items, selectedFileId, onSelect, onMove }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <h3 style={{ padding: 4 }}>Explorer</h3>
      <DirectoryList
        items={items}
        selectedFileId={selectedFileId}
        onSelect={onSelect}
        onMove={onMove}
        depth={0}
        style={{
          overflowY: "auto",
          margin: 0,
          padding: 0,
        }}
      />
    </div>
  );
}

import type { DirectoryItem, FileEntry } from ".";
import { FileItem } from "./FileItem";
import { FolderItem } from "./FolderItem";

export function DirectoryList({
  items,
  selectedFileId,
  onSelect,
  onMove,
  depth,
  style,
}: {
  items: DirectoryItem[];
  selectedFileId: string | null;
  onSelect: (file: FileEntry) => void;
  onMove: (itemId: string, targetDirId: string) => void;
  depth: number;
  style?: React.CSSProperties;
}) {
  const isRoot = depth === 0;

  const handleRootDragOver = (e: React.DragEvent) => {
    if (isRoot) e.preventDefault();
  };

  const handleRootDrop = (e: React.DragEvent) => {
    if (!isRoot) return;

    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const itemId = data.id;
      if (itemId) {
        onMove(itemId, 'root');
      }
    } catch (err) {
      console.warn('Invalid drag data', err);
    }
  };

  return (
    <ul
      style={{
        padding: 0,
        listStyle: 'none',
        textAlign: 'left',
        margin: isRoot ? 0 : 4,
        paddingLeft: isRoot ? 0 : '.5rem',
        borderLeft: isRoot ? 'none' : '1px solid #555',
        ...style,
      }}
      onDragOver={handleRootDragOver}
      onDrop={handleRootDrop}
    >
      {items.map((item) =>
        'nodes' in item ? (
          <FolderItem
            key={item.id}
            folder={item}
            selectedFileId={selectedFileId}
            onSelect={onSelect}
            onMove={onMove}
            depth={depth}
          />
        ) : (
          <FileItem
            key={item.id}
            file={item}
            selectedFileId={selectedFileId}
            onSelect={onSelect}
          />
        )
      )}
    </ul>
  );
}

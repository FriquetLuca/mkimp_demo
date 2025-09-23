import type { DirectoryItem, FileEntry } from ".";
import { FileItem } from "./FileItem";
import { FolderItem } from "./FolderItem";

export function DirectoryList({
  items,
  selectedFileId,
  onSelect,
  onMove,
  setContextMenuPos,
  depth,
  style,
}: {
  items: DirectoryItem[];
  selectedFileId: string | null;
  onSelect: (file: FileEntry) => void;
  onMove: (itemId: string, targetDirId: string) => void;
  depth: number;
  style?: React.CSSProperties;
  setContextMenuPos: React.Dispatch<React.SetStateAction<{ x: number; y: number, target: DirectoryItem } | null>>;
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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY, target: { id: '-1', name: 'root', nodes: items } });
  };

  const MaybeEmpty = isRoot ? (
      <div
        onContextMenu={handleContextMenu}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
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
        }}
        style={{ flexGrow: 1, }}
      />
    ) : undefined;

  return (
    <>
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
          "nodes" in item ? (
            <FolderItem
              key={item.id}
              folder={item}
              selectedFileId={selectedFileId}
              onSelect={onSelect}
              onMove={onMove}
              depth={depth}
              setContextMenuPos={setContextMenuPos}
            />
          ) : (
            <FileItem
              key={item.id}
              file={item}
              selectedFileId={selectedFileId}
              onSelect={onSelect}
              setContextMenuPos={setContextMenuPos}
            />
          )
        )}
      </ul>
      {MaybeEmpty}
    </>
  );
}

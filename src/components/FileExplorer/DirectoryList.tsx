import { useContextMenu } from "../../hooks/useContextMenu";
import type { DirectoryItem, FileEntry } from "../../types/fileExplorer";
import { FileItem, FolderItem } from "./items/index";

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
  const menuContext = useContextMenu();

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
    menuContext.setContextMenuPos({ x: e.clientX, y: e.clientY, target: { type: "rootdir" } });
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
        className="explorer-menu"
        style={{
          padding: 0,
          listStyle: 'none',
          textAlign: 'left',
          paddingLeft: isRoot ? 0 : '.5rem',
          borderLeft: isRoot ? 'none' : '1px solid var(--md-cspan-bg-color)',
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
      {MaybeEmpty}
    </>
  );
}

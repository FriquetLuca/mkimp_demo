import { useContextMenu } from '../../hooks/useContextMenu';
import type { DirectoryItem, FileEntry } from '../../types/fileExplorer';
import { FileItem, FolderItem } from './items/index';

export function DirectoryList({
  items,
  selectedFileId,
  onOpen,
  onSelect,
  onMove,
  depth,
  className,
}: {
  items: DirectoryItem[];
  selectedFileId: string | null;
  onOpen: (file: FileEntry) => void;
  onSelect: (file: FileEntry) => void;
  onMove: (itemId: string, targetDirId: string) => void;
  depth: number;
  className?: string;
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
    menuContext.setContextMenuPos({
      x: e.clientX,
      y: e.clientY,
      target: { type: 'rootdir' },
    });
  };

  const MaybeEmpty = isRoot ? (
    <div
      className="w-full flex-grow bg-[var(--md-table-nth-child-bg-color)]"
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
    />
  ) : undefined;

  const currentStyle = `w-min bg-[var(--md-table-nth-child-bg-color)] overflow-hidden p-0 list-none text-left ${isRoot ? 'pl-0 border-l-0' : 'pl-2 border-l border-[var(--md-cspan-bg-color)]'}`;

  return (
    <>
      <ul
        className={
          className
            ? `explorer-menu ${className} ${currentStyle}`
            : `explorer-menu ${currentStyle}`
        }
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
              onOpen={onOpen}
              onMove={onMove}
              depth={depth}
            />
          ) : (
            <FileItem
              key={item.id}
              file={item}
              selectedFileId={selectedFileId}
              onSelect={onSelect}
              onOpen={onOpen}
            />
          )
        )}
      </ul>
      {MaybeEmpty}
    </>
  );
}

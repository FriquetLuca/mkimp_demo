import { useState } from "react";
import { DirectoryList } from "./DirectoryList";
import type { DirectoryEntry, FileEntry } from ".";
import { Item } from "./Item";

export function FolderItem({
  folder,
  selectedFileId,
  onSelect,
  onMove,
  depth,
}: {
  folder: DirectoryEntry;
  selectedFileId: string | null;
  onSelect: (file: FileEntry) => void;
  onMove: (itemId: string, targetDirId: string) => void;
  depth: number;
}) {
  const [open, setOpen] = useState(false);
  const [isOver, setIsOver] = useState(false); // 🆕 drag-over highlight

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const itemId = data.id;
      if (itemId && itemId !== folder.id) {
        onMove(itemId, folder.id);
        setOpen(true);
      }
    } catch (err) {
      console.warn('Invalid drag data', err);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData('application/json', JSON.stringify({ id: folder.id, type: 'folder' }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  return (
    <>
      <li
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          cursor: 'pointer',
          userSelect: 'none',
          backgroundColor: isOver
            ? 'rgba(100, 100, 255, 0.2)' // 🆕 highlight on drag over
            : 'transparent',
          transition: 'background-color 0.2s ease',
        }}
      >
        <div style={{  }} onClick={() => setOpen(!open)}>
          <Item icon={open ? '📂' : '📁'} name={folder.name} isSelected={selectedFileId === folder.id} />
        </div>
      </li>
      {open && (
        <DirectoryList
          items={folder.nodes}
          selectedFileId={selectedFileId}
          onSelect={onSelect}
          onMove={onMove}
          depth={depth + 1}
        />
      )}
    </>
  );
}

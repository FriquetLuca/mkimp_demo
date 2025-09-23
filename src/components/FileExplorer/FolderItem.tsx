import { useState } from "react";
import { DirectoryList } from "./DirectoryList";
import type { DirectoryEntry, FileEntry } from ".";

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent root from also handling this drop

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const itemId = data.id;
      if (itemId && itemId !== folder.id) {
        onMove(itemId, folder.id);
        setOpen(true); // auto-expand on drop
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

  return (
    <>
      <li
        draggable
        onDragStart={handleDragStart}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <div style={{ marginLeft: `calc(${depth} * .5em)` }} onClick={() => setOpen(!open)}>
          <p
            style={{
              padding: 2,
              margin: 2,
              marginLeft: `calc(${depth} * .5em)`,
              backgroundColor: selectedFileId === folder.id ? '#333' : 'transparent',
            }}
          >
            {open ? '📂' : '📁'} {folder.name}
          </p>
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

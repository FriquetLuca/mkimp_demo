import type { FileEntry } from ".";
import { Item } from "./Item";

export function FileItem({
  file,
  selectedFileId,
  onSelect,
}: {
  file: FileEntry;
  selectedFileId: string | null;
  onSelect: (file: FileEntry) => void;
}) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ id: file.id, type: 'file' }));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <li
      draggable
      onDragStart={handleDragStart}
      onClick={() => onSelect(file)}
      style={{
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <Item icon={"📄"} name={file.name} isSelected={selectedFileId === file.id} />
    </li>
  );
}

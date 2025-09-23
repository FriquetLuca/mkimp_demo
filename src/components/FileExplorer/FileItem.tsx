import type { FileEntry } from ".";

export function FileItem({
  file,
  selectedFileId,
  onSelect,
  depth,
}: {
  file: FileEntry;
  selectedFileId: string | null;
  onSelect: (file: FileEntry) => void;
  depth: number;
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
        backgroundColor: selectedFileId === file.id ? '#333' : 'transparent',
        marginLeft: `calc(${2 * depth} * .5em)`,
      }}
    >
      <p style={{ padding: 2, margin: 2 }}>📄 {file.name}</p>
    </li>
  );
}

import React from "react";
import type { DirectoryItem, FileEntry } from ".";
import { Item } from "./Item";

export function FileItem({
  file,
  selectedFileId,
  onSelect,
  setContextMenuPos,
}: {
  file: FileEntry;
  selectedFileId: string | null;
  onSelect: (file: FileEntry) => void;
  setContextMenuPos: React.Dispatch<React.SetStateAction<{ x: number; y: number, target: DirectoryItem } | null>>;
}) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ id: file.id, type: "file" }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY, target: file });
  };

  return (
    <>
      <li
        draggable
        onDragStart={handleDragStart}
        onClick={() => onSelect(file)}
        onContextMenu={handleContextMenu}
        style={{
          cursor: "pointer",
        }}
      >
        <Item icon={"📄"} name={file.name} isSelected={selectedFileId === file.id} />
      </li>
    </>
  );
}

import React from "react";
import Item from "./Item";
import type { FileEntry } from "..";
import { useContextMenu } from "../../../hooks/useContextMenu";

export default function FileItem({
  file,
  selectedFileId,
  onSelect,
}: {
  file: FileEntry;
  selectedFileId: string | null;
  onSelect: (file: FileEntry) => void;
}) {
  const menuContext = useContextMenu();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ id: file.id, type: "file" }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    menuContext.setContextMenuPos({ x: e.clientX, y: e.clientY, target: file });
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

import React from 'react';
import Item from './Item';
import { useContextMenu } from '../../../hooks/useContextMenu';
import type { FileEntry } from '../../../types/fileExplorer';
import Image from '../../Image';
import { fileIcons } from '../../../utils/fileIcons';

interface FileItemProps {
  file: FileEntry;
  selectedFileId: string | null;
  onSelect: (file: FileEntry) => void;
  onOpen: (file: FileEntry) => void;
}

export default function FileItem({
  file,
  selectedFileId,
  onSelect,
  onOpen,
}: FileItemProps) {
  const menuContext = useContextMenu();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ id: file.id, type: 'file' })
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    menuContext.setContextMenuPos({
      x: e.clientX,
      y: e.clientY,
      target: { type: 'file', value: file },
    });
  };

  const getFileIcon = (): React.ReactNode => {
    if (file.name === '.gitignore' || file.name === '.gitkeep') {
      return (
        <Image className="w-5 h-5" src={'/file_icons/git.svg'} alt="git" />
      );
    }

    const ext = file.name.split('.').pop();
    if (ext) {
      const data = fileIcons[ext];
      if (data) {
        return (
          <Image
            className="w-5 h-5"
            src={`/file_icons${data.src}`}
            alt={data.alt}
          />
        );
      }
    }

    return '📄';
  };

  return (
    <>
      <li
        draggable
        onDragStart={handleDragStart}
        onClick={() => onSelect(file)}
        onDoubleClick={() => onOpen(file)}
        onContextMenu={handleContextMenu}
        className="transition-colors duration-100 hover:bg-[var(--md-border-color)] cursor-pointer"
      >
        <Item
          icon={getFileIcon()}
          name={file.name}
          isSelected={selectedFileId === file.id}
        />
      </li>
    </>
  );
}

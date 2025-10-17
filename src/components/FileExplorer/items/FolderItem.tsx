import { useState } from 'react';
import { DirectoryList } from '../DirectoryList';
import Item from './Item';
import { useContextMenu } from '../../../hooks/useContextMenu';
import type {
  DirectoryEntry,
  DirectoryItem,
  FileEntry,
} from '../../../types/fileExplorer';

interface FolderItemProps {
  folder: DirectoryEntry;
  selectedFileIds: string[];
  onSelect: (item: DirectoryItem, add?: boolean) => void;
  onOpen: (file: FileEntry) => void;
  onMove: (itemId: string, targetDirId: string) => void;
  depth: number;
}

export default function FolderItem({
  folder,
  selectedFileIds,
  onSelect,
  onOpen,
  onMove,
  depth,
}: FolderItemProps) {
  const menuContext = useContextMenu();

  const [open, setOpen] = useState(false);
  const [isOver, setIsOver] = useState(false); // drag-over

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
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ id: folder.id, type: 'folder' })
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    menuContext.setContextMenuPos({
      x: e.clientX,
      y: e.clientY,
      target: { type: 'directory', value: folder },
    });
  };

  const handleFileClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      onSelect(folder, true);
    } else {
      onSelect(folder);
      setOpen(!open);
    }
  };

  return (
    <>
      <li
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onContextMenu={handleContextMenu}
        onClick={handleFileClick}
        className={`hover:bg-[var(--md-border-color)] w-full cursor-pointer transition-colors duration-200 ease-in-out ${isOver ? 'bg-[rgba(100,100,255,0.2)]' : ''}`}
      >
        <Item
          icon={open ? '📂' : '📁'}
          name={folder.name}
          isSelected={selectedFileIds.includes(folder.id)}
        />
      </li>
      {open && (
        <DirectoryList
          items={folder.nodes}
          selectedFileIds={selectedFileIds}
          onSelect={onSelect}
          onOpen={onOpen}
          onMove={onMove}
          depth={depth + 1}
        />
      )}
    </>
  );
}

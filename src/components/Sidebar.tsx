import { ContextMenuProvider } from '../provider/ContextMenuProvider';
import type { DirectoryItem, FileEntry } from '../types/fileExplorer';
import { createContextMenu } from '../builders/createContextMenu';
import FileExplorer from './FileExplorer';

type SidebarProps = {
  sidebarWidth: number;
  items: DirectoryItem[];
  selectedFileId: string | null;
  handleMove: (itemId: string, targetDirId: string) => void;
  setItems: (newItems: DirectoryItem[]) => void;
  onOpen: (file: FileEntry) => void;
  onSelect: (file: FileEntry) => void;
};

export default function Sidebar({
  sidebarWidth,
  items,
  setItems,
  selectedFileId,
  handleMove,
  onSelect,
  onOpen,
}: SidebarProps) {
  return (
    <div
      className="h-screen overflow-y-auto border-r bg-[var(--md-table-nth-child-bg-color)] border-[var(--md-bg-code-color)]"
      style={{
        width: sidebarWidth,
      }}
    >
      <ContextMenuProvider
        createMenu={createContextMenu({
          items,
          setItems,
        })}
        className="bg-[var(--md-bg-code-color)] border border-[var(--md-cspan-bg-color)] shadow-[0_2px_8px_rgba(0,0,0,0.15)] z-[1000] select-none min-w-[120px] rounded-[8px]"
      >
        <FileExplorer
          items={items}
          selectedFileId={selectedFileId}
          onSelect={onSelect}
          onOpen={onOpen}
          onMove={handleMove}
        />
      </ContextMenuProvider>
    </div>
  );
}

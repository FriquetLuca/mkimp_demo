import { ContextMenuProvider } from '../provider/ContextMenuProvider';
import type { DirectoryItem, FileEntry } from '../types/fileExplorer';
import { createContextMenu } from '../builders/createContextMenu';
import FileExplorer from './FileExplorer';
import Sidebar from './Sidebar';

interface EditorLayoutProps {
  sidebarWidth: number;
  sidebarRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  direction?: 'left' | 'right';
  items: DirectoryItem[];
  selectedFileId: string | null;
  children: React.ReactNode;
  onMove: (itemId: string, targetDirId: string) => void;
  setItems: (newItems: DirectoryItem[]) => void;
  onOpen: (file: FileEntry) => void;
  onSelect: (file: FileEntry) => void;
  onSeparatorMouseDown: (e: React.MouseEvent) => void;
}

export default function EditorLayout({
  items,
  setItems,
  selectedFileId,
  onMove,
  onSelect,
  onOpen,
  direction = 'left',
  children,
  ...options
}: EditorLayoutProps) {
  return (
    <Sidebar
      {...options}
      sidebarContent={
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
            onMove={onMove}
          />
        </ContextMenuProvider>
      }
    >
      {children}
    </Sidebar>
  );
}

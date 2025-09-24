import { ContextMenuProvider } from "../provider/ContextMenuProvider";
import type { DirectoryItem, FileEntry } from "../types/fileExplorer";
import { createContextMenu } from "../builders/createContextMenu";
import FileExplorer from "./FileExplorer";

type SidebarProps = {
    sidebarWidth: number;
    items: DirectoryItem[];
    selectedFileId: string | null;
    handleMove: (itemId: string, targetDirId: string) => void;
    setItems: (newItems: DirectoryItem[]) => void;
    onSelect: (file: FileEntry) => void;
};

export default function Sidebar({
    sidebarWidth,
    items,
    setItems,
    selectedFileId,
    handleMove,
    onSelect,
}: SidebarProps) {
    
    

    return (
        <div
            style={{
                width: sidebarWidth,
                height: '100vh', // or flex container height
                overflowY: 'auto', // vertical scroll if content overflows
                borderRight: '1px solid #333',
                backgroundColor: '#393939',
            }}
        >
            <ContextMenuProvider
                createMenu={createContextMenu({
                    items,
                    setItems,
                })}
                style={{
                    backgroundColor: "#333",
                    border: "1px solid #555",
                    padding: 4,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    zIndex: 1000,
                    userSelect: "none",
                    minWidth: 120,
                    color: "#fff",
                }}
            >
                <FileExplorer
                    items={items}
                    selectedFileId={selectedFileId}
                    onSelect={onSelect}
                    onMove={handleMove}
                />
            </ContextMenuProvider>
        </div>
    )
}
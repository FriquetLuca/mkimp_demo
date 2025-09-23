import FileExplorerWrapper, { type DirectoryItem, type FileEntry } from "./FileExplorer";

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
        <FileExplorerWrapper
            items={items}
            selectedFileId={selectedFileId}
            onSelect={onSelect}
            onMove={handleMove}
            setItems={setItems}
        />
    </div>
    )
}
import { ContextMenuProvider } from "../provider/ContextMenuProvider";
import FileExplorer, { type DirectoryItem, type FileEntry } from "./FileExplorer";

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
    const createItem = (target: DirectoryItem) => {
        const name = prompt("Enter name for new file/folder:");
        if (!name) return;

        const isFolder = window.confirm("Create folder? Cancel = file");
        const newItem: DirectoryItem = isFolder
        ? { id: crypto.randomUUID(), name, nodes: [] }
        : { id: crypto.randomUUID(), name, content: "" };

        if ("nodes" in target) {
            // target is a folder, add inside
            const newItems = addItem(items, target.id, newItem);
            setItems(newItems);
        } else {
            alert("Cannot create inside a file");
        }
    }

    const renameItem = (target: DirectoryItem) => {
        const newName = prompt("Enter new name:", target.name);
        if (!newName) return;

        //const newItems = renameItemById(items, target.id, newName);
        //setItems(newItems);
    }

    const deleteItem = (target: DirectoryItem) => {
        if (!confirm(`Delete '${target.name}'? This action cannot be undone.`)) return;
    }

    const addItem = (arr: DirectoryItem[], targetDirId: string, newItem: DirectoryItem): DirectoryItem[] => {
        return arr.map((item) => {
        if ("nodes" in item) {
            if (item.id === targetDirId) {
            return { ...item, nodes: [...item.nodes, newItem] };
            } else {
            return { ...item, nodes: addItem(item.nodes, targetDirId, newItem) };
            }
        }
        return item;
        });
    }

    const createMenu = (target: DirectoryItem, closeMenu: () => void) => {
        return (
            <ul style={{ listStyle: "none", margin: 0, padding: 4 }}>
                <li
                    style={{ padding: "4px 8px", cursor: "pointer" }}
                    onClick={() => {
                        createItem(target);
                        closeMenu();
                    }}
                >
                    Create
                </li>
                <li
                    style={{ padding: "4px 8px", cursor: "pointer" }}
                    onClick={() => {
                        renameItem(target);
                        closeMenu();
                    }}
                >
                    Rename
                </li>
                <li
                    style={{ padding: "4px 8px", cursor: "pointer", color: "red" }}
                    onClick={() => {
                        deleteItem(target);
                        closeMenu();
                    }}
                >
                    Delete
                </li>
            </ul>
        )
    }

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
                createMenu={createMenu}
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
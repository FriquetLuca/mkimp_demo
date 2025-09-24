import type { DirectoryEntry, DirectoryItem, FileEntry } from "../types/fileExplorer";
import { createDirectory, createFile, deleteDirectoryItem, renameDirectoryItem } from "../utils/directoryItem";

type ContextMenuFile = {
    type: "file",
    value: FileEntry,
}

type ContextMenuDirectory = {
    type: "directory",
    value: DirectoryEntry,
}

type ContextMenuRootDir = {
    type: "rootdir",
}

export type ContextMenuValue = ContextMenuFile | ContextMenuDirectory | ContextMenuRootDir;

export type ContextMenuItem = {
    label: string;
    filter?: (value: ContextMenuValue) => boolean;
    handler: (target: ContextMenuValue) => void | Promise<void>;
    style?: React.CSSProperties;
};

type generateDirectoryItemHandlers = {
    items: DirectoryItem[];
    setItems: (newItems: DirectoryItem[]) => void;
};

export function generateDirectoryItemHandlers({
    items,
    setItems,
}: generateDirectoryItemHandlers): ContextMenuItem[] {
    const newFileItem = (ctx: ContextMenuValue) => {
        const name = prompt("Enter name for new file");
        if (!name) return;

        const result = createFile(name, "", ctx.type === "rootdir" ? "root" : ctx.value.id, items);
        if(result.success) {
            setItems(result.value);
        } else {
            alert(result.error);
        }
    }

    const newDirectoryItem = (ctx: ContextMenuValue) => {
        const name = prompt("Enter name for new directory");
        if (!name) return;

        const result = createDirectory(name, ctx.type === "rootdir" ? "root" : ctx.value.id, items);
        if(result.success) {
            setItems(result.value);
        } else {
            alert(result.error);
        }
    }

    const renameItem = (target: ContextMenuValue) => {
        if(target.type === "rootdir") return;
        const newName = prompt("Enter new name:", target.value.name);
        if (!newName) return;

        const result = renameDirectoryItem(target.value.id, newName, items);
        if(result.success) {
            setItems(result.value);
        } else {
            alert(result.error);
        }
    }

    const deleteItem = (target: ContextMenuValue) => {
        if(target.type === "rootdir") return;
        if (!confirm(`Delete '${target.value.name}'? This action cannot be undone.`)) return;

        const result = deleteDirectoryItem(target.value.id, items);
        if(result.success) {
            setItems(result.value);
        } else {
            alert(result.error);
        }
    }

    return [
        {
            label: "New File...",
            handler: (target) => newFileItem(target),
        },
        {
            label: "New Directory...",
            handler: (target) => newDirectoryItem(target),
        },
        {
            label: "Rename...",
            filter: (v) => v.type !== "rootdir",
            handler: (target) => renameItem(target),
        },
        {
            label: "Delete",
            filter: (v) => v.type !== "rootdir",
            handler: (target) => deleteItem(target),
            style: {
                color: "red",
            }
        },
    ]
}

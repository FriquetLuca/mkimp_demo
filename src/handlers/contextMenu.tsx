import { useState } from "react";
import Confirm from "../components/ContextMenuModals/Confirm";
import RenameItemModal from "../components/ContextMenuModals/RenameItemModal";
import { useModal } from "../hooks/useModal";
import type { DirectoryEntry, DirectoryItem, FileEntry } from "../types/fileExplorer";
import { createDirectory, createFile, deleteDirectoryItem, isDirectory } from "../utils/directoryItem";

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
    const [hideDelete, setHideDelete] = useState(false);
    const { open, close } = useModal();
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
        if (target.type === "rootdir") return;

        open(
            <RenameItemModal
                id={target.value.id}
                items={items}
                isDirectory={isDirectory(target.value)}
                currentName={target.value.name}
                onCancel={close}
                onRename={(items) => {
                    setItems(items);
                    close();
                }}
            />,
            { containerOnly: false }
        );
    };

    const deleteItem = (target: ContextMenuValue) => {
        if(target.type === "rootdir") return;
        if(hideDelete) {
            const result = deleteDirectoryItem(target.value.id, items);
            if(result.success) {
                setItems(result.value);
                close();
            } else {
                alert(result.error);
            }
        } else {
            open((
                <Confirm
                    label={<span>Are you sure you want to delete <code aria-label="Code" className="md-codespan">{target.value.name}</code>?</span>}
                    onYes={() => {
                        const result = deleteDirectoryItem(target.value.id, items);
                        if(result.success) {
                            setItems(result.value);
                            close();
                        } else {
                            alert(result.error);
                        }
                    }}
                    onNo={() => close()}
                />
            ), { containerOnly: true, });
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

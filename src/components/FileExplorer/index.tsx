import { useRef, useState } from 'react';
import { DirectoryList } from './DirectoryList';
import { ContextMenu } from './ContextMenu';

export type FileEntry = {
  id: string;
  name: string;
  content: string;
};

export type DirectoryEntry = {
  id: string;
  name: string;
  nodes: DirectoryItem[];
};

export type DirectoryItem = DirectoryEntry | FileEntry;

type Props = {
  items: DirectoryItem[];
  selectedFileId: string | null;
  onSelect: (file: FileEntry) => void;
  onMove: (itemId: string, targetDirId: string) => void;
};

export function moveItem(
  items: DirectoryItem[],
  itemId: string,
  targetDirId: string
): DirectoryItem[] {
  let draggedItem: DirectoryItem | null = null;

  function removeItem(arr: DirectoryItem[]): DirectoryItem[] {
    return arr
      .map((item) => {
        if (item.id === itemId) {
          draggedItem = item;
          return null;
        } else if ('nodes' in item) {
          return {
            ...item,
            nodes: removeItem(item.nodes),
          };
        }
        return item;
      })
      .filter(Boolean) as DirectoryItem[];
  }

  function addItem(arr: DirectoryItem[]): DirectoryItem[] {
    return arr.map((item) => {
      if ('nodes' in item && item.id === targetDirId && draggedItem) {
        return {
          ...item,
          nodes: [...item.nodes, draggedItem],
        };
      } else if ('nodes' in item) {
        return {
          ...item,
          nodes: addItem(item.nodes),
        };
      }
      return item;
    });
  }

  let newItems = removeItem(items);

  if (!draggedItem) {
    console.warn('Dragged item not found');
    return items;
  }
  if (targetDirId === 'root') {
    newItems = [...newItems, draggedItem];
  } else {
    newItems = addItem(newItems);
  }

  return newItems;
}

function FileExplorer({ items, selectedFileId, onSelect, onMove, onContextMenuAction }: Props & { onContextMenuAction: any }) {
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number, target: DirectoryItem } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => {
    setContextMenuPos(null)
  };

  return (
    <div style={{ paddingLeft: 4, paddingRight: 4, display: "flex", flexDirection: "column", height: "100%" }}>
      <h3 style={{ textAlign: "center" }}>Files</h3>
      <DirectoryList
        items={items}
        selectedFileId={selectedFileId}
        onSelect={onSelect}
        onMove={onMove}
        depth={0}
        setContextMenuPos={setContextMenuPos}
        style={{
          overflowY: "auto",
          margin: 0,
          padding: 0,
        }}
      />
      {contextMenuPos && (
        <ContextMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          menuRef={menuRef}
          onClose={closeMenu}
          onCreate={() => onContextMenuAction("create", contextMenuPos!.target)}
          onRename={() => onContextMenuAction("rename", contextMenuPos!.target)}
          onDelete={() => onContextMenuAction("delete", contextMenuPos!.target)}
        />
      )}
    </div>
  );
}

export default function FileExplorerWrapper({ items, selectedFileId, onSelect, onMove, setItems }: {
  items: DirectoryItem[],
  selectedFileId: string | null,
  onSelect: (file: FileEntry) => void,
  onMove: (itemId: string, targetDirId: string) => void,
  setItems: (newItems: DirectoryItem[]) => void;
}) {

  function createItem(target: DirectoryItem) {
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

  function renameItem(target: DirectoryItem) {
    const newName = prompt("Enter new name:", target.name);
    if (!newName) return;

    //const newItems = renameItemById(items, target.id, newName);
    //setItems(newItems);
  }

  function deleteItem(target: DirectoryItem) {
    if (!confirm(`Delete '${target.name}'? This action cannot be undone.`)) return;
  }

  function addItem(arr: DirectoryItem[], targetDirId: string, newItem: DirectoryItem): DirectoryItem[] {
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

  // Handle context menu actions
  const handleContextMenuAction = (action: "create" | "rename" | "delete", item: DirectoryItem) => {
    console.log("action")
    console.log(item)
    switch (action) {
      case "create":
        createItem(item);
        break;
      case "rename":
        renameItem(item);
        break;
      case "delete":
        deleteItem(item);
        break;
    }
  };

  return (
    <FileExplorer
      items={items}
      selectedFileId={selectedFileId}
      onSelect={onSelect}
      onMove={onMove}
      onContextMenuAction={handleContextMenuAction}
    />
  );
}

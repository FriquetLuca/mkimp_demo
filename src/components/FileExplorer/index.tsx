import { DirectoryList } from './DirectoryList';

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

export default function FileExplorer({ items, selectedFileId, onSelect, onMove }: Props) {
  return (
    <div
      style={{
        paddingLeft: 4,
        paddingRight: 4,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <h3 style={{ textAlign: 'center' }}>Files</h3>
      <DirectoryList
        items={items}
        selectedFileId={selectedFileId}
        onSelect={onSelect}
        onMove={onMove}
        depth={0}
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          margin: 0,
          padding: 0,
        }}
      />
    </div>
  );
}

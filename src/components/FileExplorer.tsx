import { useState } from 'react';
import { type DirectoryItem, type DirectoryEntry, type FileEntry } from '../data/files';

type Props = {
  items: DirectoryItem[];
  selectedFileId: string | null;
  onSelect: (file: FileEntry) => void;
};

export default function FileExplorer({ items, selectedFileId, onSelect }: Props) {
  return (
    <div>
      <h3 style={{ textAlign: 'center' }}>Files</h3>
      <DirectoryList
        items={items}
        selectedFileId={selectedFileId}
        onSelect={onSelect}
        depth={0}
      />
    </div>
  );
}

function DirectoryList({
  items,
  selectedFileId,
  onSelect,
  depth,
}: {
  items: DirectoryItem[];
  selectedFileId: string | null;
  onSelect: (file: FileEntry) => void;
  depth: number;
}) {
  return (
    <ul style={{ padding: 0, listStyle: 'none', textAlign: 'left' }}>
      {items.map((item) => {
        if ('nodes' in item) {
          return (
            <FolderItem
              key={item.id}
              folder={item}
              selectedFileId={selectedFileId}
              onSelect={onSelect}
              depth={depth}
            />
          );
        } else {
          return (
            <li
              key={item.id}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedFileId === item.id ? '#333' : 'transparent',
              }}
              onClick={() => onSelect(item)}
            >
              <p style={{
                padding: 2,
                margin: 2,
                marginLeft: `calc(${2 * depth} * .5em)`,
              }}>📄 {item.name}</p>
            </li>
          );
        }
      })}
    </ul>
  );
}

function FolderItem({
  folder,
  selectedFileId,
  onSelect,
  depth,
}: {
  folder: DirectoryEntry;
  selectedFileId: string | null;
  onSelect: (file: FileEntry) => void;
  depth: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <li>
        <div
          style={{ marginLeft: `calc(${depth} * .5em)`, cursor: 'pointer' }}
          onClick={() => setOpen(!open)}
        >
          <p style={{
            padding: 2,
            margin: 2,
            marginLeft: `calc(${depth} * .5em)`,
          }}>{open ? '📂' : '📁'} {folder.name}</p>
        </div>
      </li>
      {open && (
        <DirectoryList
          items={folder.nodes}
          selectedFileId={selectedFileId}
          onSelect={onSelect}
          depth={depth + 1}
        />
      )}
    </>
  );
}

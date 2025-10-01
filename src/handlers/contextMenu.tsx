import { useState } from 'react';
import RenameItemModal from '../components/ContextMenuModals/RenameItemModal';
import { useModal } from '../hooks/useModal';
import type {
  DirectoryEntry,
  DirectoryItem,
  FileEntry,
} from '../types/fileExplorer';
import { deleteDirectoryItem, isDirectory } from '../utils/directoryItem';
import { useTranslation } from 'react-i18next';
import DeleteItemModal from '../components/ContextMenuModals/DeleteItemModal';
import CreateFileModal from '../components/ContextMenuModals/CreateFileModal';
import CreateFolderModal from '../components/ContextMenuModals/CreateFolderModal';

interface ContextMenuFile {
  type: 'file';
  value: FileEntry;
}

interface ContextMenuDirectory {
  type: 'directory';
  value: DirectoryEntry;
}

interface ContextMenuRootDir {
  type: 'rootdir';
}

export type ContextMenuValue =
  | ContextMenuFile
  | ContextMenuDirectory
  | ContextMenuRootDir;

export interface ContextMenuItem {
  label: string;
  filter?: (value: ContextMenuValue) => boolean;
  handler: (target: ContextMenuValue) => void | Promise<void>;
  className?: string;
}

interface generateDirectoryItemHandlers {
  items: DirectoryItem[];
  setItems: (newItems: DirectoryItem[]) => void;
}

export function generateDirectoryItemHandlers({
  items,
  setItems,
}: generateDirectoryItemHandlers): ContextMenuItem[] {
  const { t } = useTranslation();
  const [hideDelete, setHideDelete] = useState(false);
  const { open, close } = useModal();
  const newFileItem = (ctx: ContextMenuValue) => {
    open(
      <CreateFileModal
        items={items}
        targetId={ctx.type === 'rootdir' ? 'root' : ctx.value.id}
        onCreate={(items) => {
          setItems(items);
          close();
        }}
        onCancel={close}
      />,
      { containerOnly: false, static: true }
    );
  };

  const newDirectoryItem = (ctx: ContextMenuValue) => {
    open(
      <CreateFolderModal
        items={items}
        targetId={ctx.type === 'rootdir' ? 'root' : ctx.value.id}
        onCreate={(items) => {
          setItems(items);
          close();
        }}
        onCancel={close}
      />,
      { containerOnly: false, static: true }
    );
  };

  const renameItem = (target: ContextMenuValue) => {
    if (target.type === 'rootdir') return;

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
      { containerOnly: false, static: true }
    );
  };

  const deleteItem = (target: ContextMenuValue) => {
    if (target.type === 'rootdir') return;
    if (hideDelete) {
      const result = deleteDirectoryItem(target.value.id, items);
      if (result.success) {
        setItems(result.value);
        close();
      } else {
        console.warn(result.error);
      }
    } else {
      open(
        <DeleteItemModal
          id={target.value.id}
          items={items}
          currentName={target.value.name}
          dontAskAgain={hideDelete}
          onCancel={close}
          onDelete={(items, del) => {
            setItems(items);
            setHideDelete(del);
            close();
          }}
        />,
        { containerOnly: false, static: true }
      );
    }
  };

  return [
    {
      label: t('contextMenu.labels.newFile'),
      handler: (target) => newFileItem(target),
    },
    {
      label: t('contextMenu.labels.newFolder'),
      handler: (target) => newDirectoryItem(target),
    },
    {
      label: t('contextMenu.labels.renameItem'),
      filter: (v) => v.type !== 'rootdir',
      handler: (target) => renameItem(target),
    },
    {
      label: t('contextMenu.labels.deleteItem'),
      filter: (v) => v.type !== 'rootdir',
      handler: (target) => deleteItem(target),
      className: 'text-red-500',
    },
  ];
}

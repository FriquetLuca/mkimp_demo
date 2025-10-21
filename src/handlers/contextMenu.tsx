import { useState } from 'react';
import { useModal } from '../hooks/useModal';
import type {
  DirectoryEntry,
  DirectoryItem,
  FileEntry,
} from '../types/fileExplorer';
import {
  deleteDirectoryItem,
  deleteDirectoryItems,
  isDirectory,
} from '../utils/directoryItem';
import { useTranslation } from 'react-i18next';
import {
  CreateFileModal,
  CreateFolderModal,
  DeleteItemModal,
  RenameItemModal,
} from '../components/ContextMenuModals';
import DeleteItemsModal from '../components/ContextMenuModals/DeleteItemsModal';

interface ContextMenuFile {
  type: 'file';
  value: FileEntry;
}

interface ContextMenuDirectory {
  type: 'directory';
  value: DirectoryEntry;
}

type ContextMenuExplorerItem = ContextMenuFile | ContextMenuDirectory;

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
  selectedFileIds: string[];
  onOpens: (fileIds: string[]) => void;
  items: DirectoryItem[];
  setItems: (newItems: DirectoryItem[]) => void;
}

export function generateDirectoryItemHandlers({
  items,
  setItems,
  selectedFileIds,
  onOpens,
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

  const deleteItems = (ids: string[]) => {
    if (hideDelete) {
      const result = deleteDirectoryItems(ids, items);
      setItems(result);
      close();
    } else {
      open(
        <DeleteItemsModal
          count={ids.length}
          dontAskAgain={hideDelete}
          onCancel={close}
          onDelete={(del) => {
            const result = deleteDirectoryItems(ids, items);
            setItems(result);
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
      label: t('contextMenu.labels.open'),
      filter: (v) => v.type === 'file' && selectedFileIds.length > 0,
      handler: (t) => {
        const fileContext = t as ContextMenuFile;
        if (selectedFileIds.includes(fileContext.value.id)) {
          onOpens(selectedFileIds);
        } else {
          onOpens([fileContext.value.id]);
        }
      },
    },
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
      handler: (t) => {
        const item = t as ContextMenuExplorerItem;
        if (selectedFileIds.includes(item.value.id)) {
          deleteItems(selectedFileIds);
        } else {
          deleteItem(item);
        }
      },
      className: 'text-red-500',
    },
  ];
}

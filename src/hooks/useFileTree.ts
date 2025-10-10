import localforage from 'localforage';
import { useEffect, useState } from 'react';
import type { DirectoryItem } from '../types/fileExplorer';
import { sortDirectoryItems } from '../utils/directoryItem';

const STORAGE_KEY = 'filesTree';

export function usePersistentFilesTree(initialValue: DirectoryItem[] = []) {
  const [filesTree, setFilesTree] = useState<DirectoryItem[]>(initialValue);
  const [loading, setLoading] = useState(true);

  // Load from localForage on mount
  useEffect(() => {
    localforage.getItem<DirectoryItem[]>(STORAGE_KEY).then((data) => {
      if (data) {
        setFilesTree(sortDirectoryItems(data));
      }
      setLoading(false);
    });
  }, []);

  // Save to localForage whenever filesTree changes
  useEffect(() => {
    if (!loading) {
      localforage.setItem(STORAGE_KEY, filesTree);
    }
  }, [filesTree, loading]);

  const setItems = (items: DirectoryItem[]) =>
    setFilesTree(sortDirectoryItems(items));

  return {
    filesTree,
    setItems,
    loading,
  };
}

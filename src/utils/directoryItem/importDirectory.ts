import type { DirectoryItem } from '../../types/fileExplorer';
import { deepClone } from '../deepClone';
import { directoryMerge } from './directoryMerge';
import { regenerateIds } from './regenerateIds';

export function importDirectory(
  oldItems: DirectoryItem[],
  newItems: DirectoryItem[]
) {
  const oldRoot = {
    id: 'root',
    name: '',
    nodes: deepClone(oldItems),
  };
  const newRoot = {
    id: 'root',
    name: '',
    nodes: deepClone(newItems),
  };
  regenerateIds(newRoot);
  newRoot.id = 'root';
  newRoot.name = '';
  directoryMerge(oldRoot, newRoot);
  return oldRoot.nodes;
}

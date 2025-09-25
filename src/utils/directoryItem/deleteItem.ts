import type { Result } from '../../types/defaults';
import type { DirectoryItem } from '../../types/fileExplorer';
import { deepClone } from '../deepClone';
import { findParent } from './findParent';

export type DeleteError = 'target_not_found';

export function deleteDirectoryItem(
  targetId: string,
  allItems: DirectoryItem[]
): Result<DirectoryItem[], DeleteError> {
  const root = {
    id: 'root',
    name: '',
    nodes: deepClone(allItems),
  };

  const parent = findParent(targetId, root);
  if (!parent) {
    return {
      success: false,
      error: 'target_not_found',
    };
  }

  parent.nodes = parent.nodes.filter((item) => item.id !== targetId);

  return {
    success: true,
    value: root.nodes,
  };
}

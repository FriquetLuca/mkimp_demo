import type { Result } from '../../types/defaults';
import type { DirectoryItem } from '../../types/fileExplorer';
import { deepClone } from '../deepClone';
import type { CreateError } from './createFile';
import { findById } from './findById';
import { findParent } from './findParent';
import { insertDirectory } from './insertDirectory';
import { isDirectory } from './isDirectory';

export function createDirectory(
  path: string,
  targetId: string,
  allItems: DirectoryItem[]
): Result<DirectoryItem[], CreateError> {
  const root = {
    id: 'root',
    name: '',
    nodes: deepClone(allItems),
  };
  const target = findById(targetId, root);
  if (target) {
    if (isDirectory(target)) {
      insertDirectory(path, target);
      return {
        success: true,
        value: root.nodes,
      };
    }
    const parent = findParent(targetId, root);
    if (parent && isDirectory(parent)) {
      insertDirectory(path, parent);
      return {
        success: true,
        value: root.nodes,
      };
    }
  }
  return {
    success: false,
    error: 'target_not_found',
  };
}

import type { Result } from '../../types/defaults';
import type { DirectoryItem } from '../../types/fileExplorer';
import { deepClone } from '../deepClone';
import { findById } from './findById';
import { findParent } from './findParent';
import { getAvailableName } from './getAvailableName';
import { isDirectory } from './isDirectory';
import { directoryMerge } from './directoryMerge';

export type MoveError = 'target_not_found' | 'location_not_found';

export function moveDirectoryItem(
  targetId: string,
  locationId: string,
  allItems: DirectoryItem[]
): Result<DirectoryItem[], MoveError> {
  const root = {
    id: 'root',
    name: '',
    nodes: deepClone(allItems),
  };

  const target = findById(targetId, root);
  if (!target) return { success: false, error: 'target_not_found' };

  const originalParent = findParent(targetId, root);
  if (!originalParent) return { success: false, error: 'target_not_found' };

  let location = findById(locationId, root);
  if (!location) return { success: false, error: 'location_not_found' };

  // If location is a file, use its parent
  if (!isDirectory(location)) {
    const fileParent = findParent(locationId, root);
    if (!fileParent) return { success: false, error: 'location_not_found' };
    location = fileParent;
  }

  // Early return: target already in desired location (and not being renamed or merged)
  const isSameLocation = location.id === originalParent.id;
  const nameConflict = location.nodes.some(
    (item) => item.name === target.name && item.id !== target.id
  );

  if (isSameLocation && !nameConflict) {
    return { success: true, value: allItems };
  }

  // Check for conflict
  const existing = location.nodes.find((item) => item.name === target.name);

  if (existing && isDirectory(existing) && isDirectory(target)) {
    // Merge directories
    directoryMerge(existing, target);

    // Remove original directory
    originalParent.nodes = originalParent.nodes.filter(
      (item) => item.id !== targetId
    );
  } else {
    // Clone and optionally rename
    const clonedItem = deepClone(target);

    if (existing) {
      clonedItem.name = getAvailableName(clonedItem.name, location.nodes);
    }

    // Remove from original
    originalParent.nodes = originalParent.nodes.filter(
      (item) => item.id !== targetId
    );

    // Add to new location
    location.nodes.push(clonedItem);
  }

  return {
    success: true,
    value: root.nodes,
  };
}

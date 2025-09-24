import type { Result } from "../../types/defaults";
import type { DirectoryEntry, DirectoryItem } from "../../types/fileExplorer";
import { deepClone } from "../deepClone";
import { findById } from "./findById";
import { findParent } from "./findParent";
import { isDirectory } from "./isDirectory";

function mergeDirectories(
  targetDir: DirectoryEntry,
  sourceDir: DirectoryEntry
): void {
  for (const sourceChild of sourceDir.nodes) {
    const existingChild = targetDir.nodes.find(
      (item) => item.name === sourceChild.name
    );

    // Case 1: both are directories -> recursively merge
    if (
      existingChild &&
      isDirectory(existingChild) &&
      isDirectory(sourceChild)
    ) {
      mergeDirectories(existingChild, sourceChild);
    }
    // Case 2: name conflict (e.g., same name but one is a file) -> rename source
    else if (existingChild) {
      const renamedChild = deepClone(sourceChild);
      renamedChild.name = getAvailableName(sourceChild.name, targetDir.nodes);
      targetDir.nodes.push(renamedChild);
    }
    // Case 3: no conflict -> add cloned source
    else {
      targetDir.nodes.push(deepClone(sourceChild));
    }
  }
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getAvailableName(baseName: string, siblings: DirectoryItem[]): string {
  const isFile = baseName.includes('.');

  let nameWithoutExt = baseName;
  let extension = '';

  if (isFile) {
    const lastDot = baseName.lastIndexOf('.');
    nameWithoutExt = baseName.slice(0, lastDot);
    extension = baseName.slice(lastDot); // includes the dot
  }

  const regex = new RegExp(`^${escapeRegExp(nameWithoutExt)}_Copy\\((\\d+)\\)${escapeRegExp(extension)}$`);
  const usedNumbers = new Set<number>();

  for (const sibling of siblings) {
    if (sibling.name === baseName) continue;
    const match = sibling.name.match(regex);
    if (match) {
      usedNumbers.add(Number(match[1]));
    }
  }

  let copyNumber = 1;
  while (usedNumbers.has(copyNumber)) {
    copyNumber++;
  }

  return `${nameWithoutExt}_Copy(${copyNumber})${extension}`;
}

export type MoveError = "target_not_found" | "location_not_found";

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
  if (!target) return { success: false, error: "target_not_found" };

  const originalParent = findParent(targetId, root);
  if (!originalParent) return { success: false, error: "target_not_found" };

  let location = findById(locationId, root);
  if (!location) return { success: false, error: "location_not_found" };

  // If location is a file, use its parent
  if (!isDirectory(location)) {
    const fileParent = findParent(locationId, root);
    if (!fileParent) return { success: false, error: "location_not_found" };
    location = fileParent;
  }

  // Check for conflict
  const existing = location.nodes.find(item => item.name === target.name);

  if (existing && isDirectory(existing) && isDirectory(target)) {
    // Merge directories
    mergeDirectories(existing, target);
    
    // Remove original directory
    originalParent.nodes = originalParent.nodes.filter((item) => item.id !== targetId);

  } else {
    // Clone and optionally rename
    const clonedItem = deepClone(target);

    if (existing) {
      clonedItem.name = getAvailableName(clonedItem.name, location.nodes);
    }

    // Remove from original
    originalParent.nodes = originalParent.nodes.filter((item) => item.id !== targetId);

    // Add to new location
    location.nodes.push(clonedItem);
  }

  return {
    success: true,
    value: root.nodes,
  };
}

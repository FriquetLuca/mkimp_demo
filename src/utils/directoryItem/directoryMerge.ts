import type { DirectoryEntry } from '../../types/fileExplorer';
import { deepClone } from '../deepClone';
import { getAvailableName } from './getAvailableName';
import { isDirectory } from './isDirectory';

export function directoryMerge(
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
      directoryMerge(existingChild, sourceChild);
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

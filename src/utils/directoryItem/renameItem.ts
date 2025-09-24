import type { Result } from "../../types/defaults";
import type { DirectoryItem } from "../../types/fileExplorer";
import { deepClone } from "../deepClone";
import { findById } from "./findById";
import { findParent } from "./findParent";

export type RenameError = "target_not_found" | "invalid_name" | "name_exists";

export function renameDirectoryItem(
  targetId: string,
  newName: string,
  allItems: DirectoryItem[]
): Result<DirectoryItem[], RenameError> {
  const root = {
    id: 'root',
    name: '',
    nodes: deepClone(allItems),
  };

  const target = findById(targetId, root);
  if (!target) return { success: false, error: "target_not_found" };

  if (newName.includes('/')) {
    return { success: false, error: "invalid_name" };
  }

  const parent = findParent(targetId, root);
  if (!parent) return { success: false, error: "target_not_found" };

  const nameConflict = parent.nodes.some(
    (item) => item.name === newName && item.id !== targetId
  );
  if (nameConflict) return { success: false, error: "name_exists" };

  target.name = newName;

  return {
    success: true,
    value: root.nodes,
  };
}

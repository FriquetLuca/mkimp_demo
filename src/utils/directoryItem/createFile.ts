import type { Result } from "../../types/defaults";
import type { DirectoryItem } from "../../types/fileExplorer";
import { deepClone } from "../deepClone";
import { findById } from "./findById";
import { findParent } from "./findParent";
import { insertFile } from "./insertFile";
import { isDirectory } from "./isDirectory";

export type CreateError = "target_not_found" | "file_exists";

export function createFile(path: string, content: string, targetId: string, allItems: DirectoryItem[], override?: boolean): Result<DirectoryItem[], CreateError> {
  const root = {
    id: 'root',
    name: '',
    nodes: deepClone(allItems),
  };
  const target = findById(targetId, root);
  if(target) {
    if(isDirectory(target)) {
      const result = insertFile(path, content, target, override);
      if(result.success) {
        return {
          success: true,
          value: root.nodes,
        };
      }
      return result;
    }
    const parent = findParent(targetId, root);
    if(parent && isDirectory(parent)) {
      const result = insertFile(path, content, parent, override);
      if(result.success) {
        return {
          success: true,
          value: root.nodes,
        };
      }
      return result;
    }
  }
  return {
    success: false,
    error: "target_not_found",
  }
}

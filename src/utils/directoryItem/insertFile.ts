import type { Result } from '../../types/defaults';
import type { DirectoryItem, FileEntry } from '../../types/fileExplorer';
import type { CreateError } from './createFile';
import { insertDirectory } from './insertDirectory';
import { isDirectory } from './isDirectory';

export function insertFile(
  path: string,
  content: string,
  target: DirectoryItem,
  override = false
): Result<FileEntry, CreateError> {
  if (!isDirectory(target)) throw new Error('Target must be a directory');

  const segments = path.split('/').filter(Boolean);
  const fileName = segments.pop()!;
  const parentDir = insertDirectory(segments.join('/'), target);

  const existingFile = parentDir.nodes.find(
    (n) => !isDirectory(n) && n.name === fileName
  ) as FileEntry | undefined;

  if (existingFile) {
    if (!override) {
      return { success: false, error: 'file_exists' };
    } else {
      existingFile.content = content;
      return { success: true, value: existingFile };
    }
  }

  const file: FileEntry = {
    id: crypto.randomUUID(),
    name: fileName,
    content,
  };

  parentDir.nodes.push(file);
  return { success: true, value: file };
}

import type JSZip from 'jszip';
import type { DirectoryItem } from '../../types/fileExplorer';

export function toZip(zip: JSZip, items: DirectoryItem[], pathPrefix = '') {
  for (const item of items) {
    if ('nodes' in item) {
      // It's a DirectoryEntry
      const folder = zip.folder(`${pathPrefix}${item.name}/`);
      if (folder) {
        toZip(folder, item.nodes, '');
      }
    } else {
      // It's a FileEntry
      zip.file(`${pathPrefix}${item.name}`, item.content);
    }
  }
}

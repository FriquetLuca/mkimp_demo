import type { DirectoryItem } from '../../types/fileExplorer';

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getAvailableName(
  baseName: string,
  siblings: DirectoryItem[]
): string {
  const isFile = baseName.includes('.');

  let nameWithoutExt = baseName;
  let extension = '';

  if (isFile) {
    const lastDot = baseName.lastIndexOf('.');
    nameWithoutExt = baseName.slice(0, lastDot);
    extension = baseName.slice(lastDot); // includes the dot
  }

  const regex = new RegExp(
    `^${escapeRegExp(nameWithoutExt)}_Copy\\((\\d+)\\)${escapeRegExp(extension)}$`
  );
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

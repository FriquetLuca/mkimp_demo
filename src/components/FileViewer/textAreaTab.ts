import type { FileEntry } from '../../types/fileExplorer';

type textAreaTabProps = {
  file: FileEntry;
  e: React.KeyboardEvent<HTMLTextAreaElement>;
  tabIndent: number;
  textarea: HTMLTextAreaElement;
  onChange: (updated: FileEntry) => void;
  setContent: (content: string) => void;
};

export function textAreaTab({
  textarea,
  file,
  e,
  tabIndent,
  onChange,
  setContent,
}: textAreaTabProps) {
  if (e.key !== 'Tab') return;

  e.preventDefault();

  const value = textarea.value;
  const selectionStart = textarea.selectionStart;
  const selectionEnd = textarea.selectionEnd;
  const lines = value.split('\n');

  if (selectionStart === selectionEnd) {
    const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
    const cursorColumn = selectionStart - lineStart;

    if (!e.shiftKey) {
      const mod = cursorColumn % tabIndent;
      const spacesToInsert = mod === 0 ? tabIndent : tabIndent - mod;
      const spaces = ' '.repeat(spacesToInsert);

      const before = value.slice(0, selectionStart);
      const after = value.slice(selectionEnd);
      const newContent = before + spaces + after;

      const newPos = selectionStart + spacesToInsert;
      setContent(newContent);
      onChange({ ...file, content: newContent });

      requestAnimationFrame(() => {
        textarea.selectionStart = newPos;
        textarea.selectionEnd = newPos;
      });
      return;
    }
  }

  let charCount = 0;
  let startLine = 0;
  let endLine = 0;
  let startOffsetInLine = 0;
  let endOffsetInLine = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineLength = lines[i].length + 1;
    if (charCount + lineLength > selectionStart && startLine === 0) {
      startLine = i;
      startOffsetInLine = selectionStart - charCount;
    }
    if (charCount + lineLength > selectionEnd && endLine === 0) {
      endLine = i;
      endOffsetInLine = selectionEnd - charCount;
      break;
    }
    charCount += lineLength;
  }

  if (selectionEnd === value.length) {
    endLine = lines.length - 1;
    endOffsetInLine = lines[endLine].length;
  }

  const newLines = [...lines];
  let selectionOffsetStart = 0;
  let selectionOffsetEnd = 0;

  for (let i = startLine; i <= endLine; i++) {
    const originalLine = lines[i];
    const match = originalLine.match(/^ */);
    const currentIndent = match ? match[0].length : 0;

    if (e.shiftKey) {
      const toRemove = Math.min(
        currentIndent % tabIndent || tabIndent,
        currentIndent
      );
      newLines[i] = originalLine.slice(toRemove);
      if (i === startLine) selectionOffsetStart -= toRemove;
      if (i === endLine) selectionOffsetEnd -= toRemove;
    } else {
      const nextIndent = Math.ceil((currentIndent + 1) / tabIndent) * tabIndent;
      const toAdd = nextIndent - currentIndent;
      newLines[i] = ' '.repeat(toAdd) + originalLine;
      if (i === startLine) selectionOffsetStart += toAdd;
      if (i === endLine) selectionOffsetEnd += toAdd;
    }
  }

  const newContent = newLines.join('\n');
  const newStart = selectionStart + selectionOffsetStart;
  const newEnd = selectionEnd + selectionOffsetEnd;

  setContent(newContent);
  onChange({ ...file, content: newContent });

  requestAnimationFrame(() => {
    textarea.selectionStart = newStart;
    textarea.selectionEnd = newEnd;
  });
}

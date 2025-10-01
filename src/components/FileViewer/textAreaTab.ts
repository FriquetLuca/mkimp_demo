import type { FileEntry } from '../../types/fileExplorer';
import { antiTabulation } from './antiTabulation';
import { tabulation } from './tabulation';

interface textAreaTabProps {
  file: FileEntry;
  e: React.KeyboardEvent<HTMLTextAreaElement>;
  tabIndent: number;
  textarea: HTMLTextAreaElement;
  onChange: (updated: FileEntry) => void;
  setContent: (content: string) => void;
}

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
  if (e.shiftKey) {
    const antitab = antiTabulation({
      tabIndent,
      textarea,
    });
    if (antitab) {
      setContent(antitab.content);
      onChange({ ...file, content: antitab.content });
      requestAnimationFrame(() => {
        textarea.selectionStart = antitab.newSelectionStart;
        textarea.selectionEnd = antitab.newSelectionEnd;
      });
    }
  } else {
    const { content, newSelectionStart, newSelectionEnd } = tabulation({
      tabIndent,
      textarea,
    });
    setContent(content);
    onChange({ ...file, content });
    requestAnimationFrame(() => {
      textarea.selectionStart = newSelectionStart;
      textarea.selectionEnd = newSelectionEnd;
    });
  }
}

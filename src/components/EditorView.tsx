import { useState, useEffect } from 'react';
import type { FileEntry } from '../types/fileExplorer';
import { useTranslation } from 'react-i18next';

type Props = {
  file: FileEntry | null;
  onChange: (updated: FileEntry) => void;
};

export default function EditorView({ file, onChange }: Props) {
  const { t } = useTranslation();
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    setContent(file?.content ?? '');
    setFileName(file?.name ?? '');
  }, [file]);

  if (!file) {
    return <div className="p-4">{t('editorView.selectItem')}</div>;
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedContent = e.target.value;
    setContent(updatedContent);
    onChange({ ...file, content: updatedContent });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFileName(newName);
    onChange({ ...file, name: newName });
  };

  return (
    <div className="flex flex-col flex-1 p-[0.1rem] gap-[5px] overflow-hidden w-[calc(100% - 0.5rem)] h-[calc(100% - 5px)]">
      <input
        type="text"
        value={fileName}
        onChange={handleNameChange}
        className="text-[1.2rem] font-bold border border-[var(--md-cspan-bg-color)] rounded-[4px] font-mono"
      />
      <textarea
        value={content}
        onChange={handleContentChange}
        className="flex-1 h-full font-mono resize-none border border-[var(--md-cspan-bg-color)] rounded-[4px] overflow-auto"
      />
    </div>
  );
}

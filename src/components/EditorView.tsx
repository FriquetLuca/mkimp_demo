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
    return <div style={{ padding: '1rem' }}>{t('editorView.selectItem')}</div>;
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: '0.1rem',
        gap: 5,
        width: 'calc(100% - 0.5rem)',
        height: 'calc(100% - 5px)',
        overflow: 'hidden',
      }}
    >
      <input
        type="text"
        value={fileName}
        onChange={handleNameChange}
        style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          border: '1px solid var(--md-cspan-bg-color)',
          borderRadius: '4px',
          fontFamily: 'monospace',
        }}
      />
      <textarea
        value={content}
        onChange={handleContentChange}
        style={{
          flex: 1,
          height: '100%',
          fontFamily: 'monospace',
          resize: 'none',
          border: '1px solid var(--md-cspan-bg-color)',
          borderRadius: '4px',
          overflow: 'auto',
        }}
      />
    </div>
  );
}

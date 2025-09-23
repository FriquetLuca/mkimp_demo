/*
import { type FileEntry } from '../data/files';
import { useState, useEffect } from 'react';

type Props = {
  file: FileEntry | null;
  onChange: (updated: FileEntry) => void;
};

export default function EditorView({ file, onChange }: Props) {
  const [content, setContent] = useState('');

  useEffect(() => {
    setContent(file?.content ?? '');
  }, [file]);

  if (!file) {
    return <div style={{ padding: '1rem' }}>Select a file to view/edit</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onChange({ ...file, content: e.target.value });
  };

  return (
    <div style={{ padding: '1rem', flexGrow: 1 }}>
      <h3>{file.name}</h3>
    </div>
  );
}
*/
import { type FileEntry } from '../data/files';
import { useState, useEffect } from 'react';

type Props = {
  file: FileEntry | null;
  onChange: (updated: FileEntry) => void;
};

export default function EditorView({ file, onChange }: Props) {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    setContent(file?.content ?? '');
    setFileName(file?.name ?? '');
  }, [file]);

  if (!file) {
    return <div style={{ padding: '1rem' }}>Select a file to view/edit</div>;
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
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '0.1rem', gap: 5, width: 'calc(100% - 0.5rem)', height: 'calc(100% - 5px)', overflow: 'hidden' }}>
      <input
        type="text"
        value={fileName}
        onChange={handleNameChange}
        style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          border: '1px solid #555',
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
          border: '1px solid #555',
          borderRadius: '4px',
          overflow: 'auto',
        }}
      />
    </div>
  );
}

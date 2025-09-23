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
      <textarea
        value={content}
        onChange={handleChange}
        style={{ width: '100%', height: 'calc(100vh - 100px)', fontFamily: 'monospace' }}
      />
    </div>
  );
}

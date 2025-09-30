import type { FileEntry } from '../types/fileExplorer';
import { useTranslation } from 'react-i18next';
import FileEditor from './FileEditor';

type Props = {
  file: FileEntry | null;
  onChange: (updated: FileEntry) => void;
};

export default function EditorView({ file, onChange }: Props) {
  const { t } = useTranslation();

  if (!file) {
    return <div className="p-4">{t('editorView.selectItem')}</div>;
  }

  return <FileEditor file={file} onChange={onChange} />;
}

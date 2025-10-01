import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DirectoryItem } from '../../types/fileExplorer';
import { deleteDirectoryItem } from '../../utils/directoryItem';
import DisplayError from '../DisplayError';

interface DeleteItemModalProps {
  id: string;
  items: DirectoryItem[];
  currentName: string;
  dontAskAgain: boolean;
  onDelete: (newItems: DirectoryItem[], dontAskAgain: boolean) => void;
  onCancel: () => void;
}

export default function DeleteItemModal({
  id,
  items,
  currentName,
  onDelete,
  onCancel,
  dontAskAgain,
}: DeleteItemModalProps) {
  const { t } = useTranslation();

  const [askNotAgain, setAskNotAgain] = useState(dontAskAgain);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    const result = deleteDirectoryItem(id, items);
    if (result.success) {
      setError(null);
      onDelete(result.value, askNotAgain);
    } else {
      setError(t(`modal.deleteItem.errors.${result.error}`));
    }
  };

  return (
    <div className="p-4 pt-2 flex flex-col gap-1">
      <p className="text-center text-lg mb-4">
        {t('modal.deleteItem.labels.warning', {
          item: currentName,
        })}
      </p>

      <DisplayError error={error} />

      <label className="flex items-center gap-2 ml-4 mb-4 select-none cursor-pointer">
        <input
          type="checkbox"
          checked={askNotAgain}
          onChange={(e) => setAskNotAgain(e.target.checked)}
          className="w-4 h-4"
        />
        <span>{t('modal.deleteItem.labels.doNotAskAgain')}</span>
      </label>

      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-[1.2rem] py-2.5 border-transparent rounded-[10px] confirm-btn"
        >
          {t('modal.deleteItem.labels.cancelButton')}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="px-[1.2rem] py-2.5 border-transparent rounded-[10px] confirm-btn"
        >
          {t('modal.deleteItem.labels.confirmButton')}
        </button>
      </div>
    </div>
  );
}

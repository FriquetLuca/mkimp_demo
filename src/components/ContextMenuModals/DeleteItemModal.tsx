import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DirectoryItem } from '../../types/fileExplorer';
import { deleteDirectoryItem } from '../../utils/directoryItem';

type DeleteItemModalProps = {
  id: string;
  items: DirectoryItem[];
  currentName: string;
  dontAskAgain: boolean;
  onDelete: (newItems: DirectoryItem[], dontAskAgain: boolean) => void;
  onCancel: () => void;
};

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
    <div className="p-2 pt-0 flex flex-col gap-1">
      <p className="text-center text-lg mb-4">
        {t('modal.deleteItem.labels.confirm', {
          itemName: currentName,
        })}
      </p>

      {error && (
        <p
          className="text-[0.9rem] text-red-700 mb-2"
          style={{
            color: 'color-mix(in srgb, red 70%, black 30%)',
          }}
        >
          ⚠️ {error}
        </p>
      )}

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
          {t('modal.deleteItem.labels.cancel')}
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

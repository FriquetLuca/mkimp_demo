import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DeleteItemModalProps {
  count: number;
  dontAskAgain: boolean;
  onDelete: (dontAskAgain: boolean) => void;
  onCancel: () => void;
}

export default function DeleteItemsModal({
  count,
  onDelete,
  onCancel,
  dontAskAgain,
}: DeleteItemModalProps) {
  const { t } = useTranslation();

  const [askNotAgain, setAskNotAgain] = useState(dontAskAgain);

  return (
    <div className="p-4 pt-2 flex flex-col gap-1">
      <p className="text-center text-lg mb-4">
        {t('modal.deleteItems.labels.warning', {
          count,
        })}
      </p>

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
          onClick={() => onDelete(askNotAgain)}
          className="px-[1.2rem] py-2.5 border-transparent rounded-[10px] confirm-btn"
        >
          {t('modal.deleteItem.labels.confirmButton')}
        </button>
      </div>
    </div>
  );
}

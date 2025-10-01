import React, { useState } from 'react';
import { z } from 'zod';
import type { DirectoryItem } from '../../types/fileExplorer';
import { useTranslation } from 'react-i18next';
import { createDirectory } from '../../utils/directoryItem';
import DisplayError from '../DisplayError';
import {
  reservedWindowsNames,
  validFileNameRegex,
} from '../../utils/contextualMenu';

interface CreateFolderModalProps {
  items: DirectoryItem[];
  targetId: string;
  onCreate: (newItems: DirectoryItem[]) => void;
  onCancel: () => void;
}

export default function CreateFolderModal({
  items,
  targetId,
  onCreate,
  onCancel,
}: CreateFolderModalProps) {
  const { t } = useTranslation();

  const invalidName = t('modal.createDirectory.errors.invalidName');

  const schema = z.object({
    name: z
      .string()
      .min(1, { message: t('modal.createDirectory.errors.empty') })
      .max(100, { message: t('modal.createDirectory.errors.tooLong') })
      .refine(
        (name) =>
          name
            .split('/')
            .filter(Boolean)
            .map(
              (name) =>
                !reservedWindowsNames.includes(name.toUpperCase()) &&
                validFileNameRegex.exec(name) !== null
            )
            .reduce((p, c) => p && c, true),
        { message: invalidName }
      ),
  });

  const [name, setName] = useState('');
  const [errorName, setErrorName] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = schema.safeParse({ name });
    if (!result.success) {
      setErrorName(result.error.issues.map((v) => v.message).join('\n'));
      return;
    }

    const created = createDirectory(result.data.name, targetId, items);
    if (created.success) {
      setErrorName(null);
      onCreate(created.value);
    } else {
      setErrorName(t(`modal.createDirectory.errors.${created.error}`));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 pt-2 flex flex-col gap-1">
      <label>
        {t('modal.createDirectory.labels.input')}
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded-[4px] mt-1 bg-[var(--md-bg-code-color)] text-base"
          style={{
            border:
              errorName !== null
                ? '1px solid color-mix(in srgb, red 70%, black 30%)'
                : '1px solid #333',
          }}
        />
      </label>

      <DisplayError error={errorName} />

      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-[1.2rem] py-2.5 border-transparent rounded-[10px] confirm-btn"
        >
          {t('modal.deleteItem.labels.cancelButton')}
        </button>
        <button
          type="submit"
          className="px-[1.2rem] py-2.5 border-transparent rounded-[10px] confirm-btn"
        >
          {t('modal.createDirectory.labels.button')}
        </button>
      </div>
    </form>
  );
}

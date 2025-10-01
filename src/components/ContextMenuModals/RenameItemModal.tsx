import React, { useState } from 'react';
import { z } from 'zod';
import type { DirectoryItem } from '../../types/fileExplorer';
import { renameDirectoryItem } from '../../utils/directoryItem';
import { useTranslation } from 'react-i18next';
import DisplayError from '../DisplayError';
import {
  reservedWindowsNames,
  validFileNameRegex,
} from '../../utils/contextualMenu';

interface RenameItemModalProps {
  isDirectory: boolean;
  id: string;
  currentName: string;
  items: DirectoryItem[];
  onRename: (value: DirectoryItem[]) => void;
  onCancel: () => void;
}

export default function RenameItemModal({
  isDirectory,
  id,
  items,
  currentName,
  onRename,
  onCancel,
}: RenameItemModalProps) {
  const { t } = useTranslation();
  const itemTypeName = t(
    `modal.renameItem.words.${isDirectory ? 'folder' : 'file'}`
  );
  const invalidName = t('modal.renameItem.errors.invalidName', {
    item: itemTypeName,
  });

  const schema = z.object({
    name: z
      .string()
      .min(1, t('modal.renameItem.errors.empty'))
      .max(100, t('modal.renameItem.errors.tooLong'))
      .regex(validFileNameRegex, invalidName)
      .refine((name) => !reservedWindowsNames.includes(name.toUpperCase()), {
        message: invalidName,
      }),
  });
  const [name, setName] = useState(currentName);
  const [errorName, setErrorName] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = schema.safeParse({ name });
    if (!result.success) {
      setErrorName(result.error.issues.map((v) => v.message).join('\n'));
      return;
    }

    const rename = renameDirectoryItem(id, result.data.name, items);
    if (rename.success) {
      setErrorName(null);
      onRename(rename.value);
    } else {
      if (rename.error === 'invalid_name') {
        setErrorName(invalidName);
      } else {
        setErrorName(
          t(`modal.renameItem.errors.${rename.error}`, { item: currentName })
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 pt-2 flex flex-col gap-1">
      <label>
        {t('modal.renameItem.labels.input')}
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
          {t('modal.renameItem.labels.cancelButton')}
        </button>
        <button
          type="submit"
          className="px-[1.2rem] py-2.5 border-transparent rounded-[10px] confirm-btn"
        >
          {t('modal.renameItem.labels.button')}
        </button>
      </div>
    </form>
  );
}

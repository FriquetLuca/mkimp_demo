import React, { useState } from 'react';
import { z } from 'zod';
import type { DirectoryItem } from '../../types/fileExplorer';
import { renameDirectoryItem } from '../../utils/directoryItem';
import { useTranslation } from 'react-i18next';

type RenameItemModalProps = {
  isDirectory: boolean;
  id: string;
  currentName: string;
  items: DirectoryItem[];
  onRename: (value: DirectoryItem[]) => void;
  onCancel: () => void;
};

const validFileNameRegex = /^(?!\s)(?!\.{1,2}$)[^\\\/:*?"<>|]+(?<!\s)$/;
const reservedWindowsNames = [
  'CON',
  'PRN',
  'AUX',
  'NUL',
  'COM1',
  'COM2',
  'COM3',
  'COM4',
  'COM5',
  'COM6',
  'COM7',
  'COM8',
  'COM9',
  'LPT1',
  'LPT2',
  'LPT3',
  'LPT4',
  'LPT5',
  'LPT6',
  'LPT7',
  'LPT8',
  'LPT9',
];

export default function RenameItemModal({
  isDirectory,
  id,
  items,
  currentName,
  onRename,
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
      setErrorName(result.error.message);
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
        setErrorName(t(`modal.renameItem.errors.${rename.error}`));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 pt-0 flex flex-col gap-1">
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

      <div className="flex content-center h-5">
        {errorName && (
          <p
            className="text-[0.9rem]"
            style={{
              color: 'color-mix(in srgb, red 70%, black 30%)',
            }}
          >
            ⚠️ {errorName}
          </p>
        )}
      </div>

      <div className="flex justify-center gap-4">
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

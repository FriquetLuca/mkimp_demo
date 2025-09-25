import React, { useState } from 'react';
import { z } from 'zod';
import type { DirectoryItem } from '../../types/fileExplorer';
import { useTranslation } from 'react-i18next';
import { createFile } from '../../utils/directoryItem';
import DisplayError from '../DisplayError';

type CreateFileModalProps = {
  items: DirectoryItem[];
  targetId: string;
  onCreate: (newItems: DirectoryItem[]) => void;
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

export default function CreateFileModal({
  items,
  targetId,
  onCreate,
  onCancel,
}: CreateFileModalProps) {
  const { t } = useTranslation();

  const invalidName = t('modal.createFile.errors.invalidName');

  const schema = z.object({
    name: z
      .string()
      .min(1, { message: t('modal.createFile.errors.empty') })
      .max(100, { message: t('modal.createFile.errors.tooLong') })
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

    const created = createFile(result.data.name, '', targetId, items);
    if (created.success) {
      setErrorName(null);
      onCreate(created.value);
    } else {
      setErrorName(t(`modal.createFile.errors.${created.error}`));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 pt-2 flex flex-col gap-1">
      <label>
        {t('modal.createFile.labels.input')}
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
          {t('modal.createFile.labels.cancelButton')}
        </button>
        <button
          type="submit"
          className="px-[1.2rem] py-2.5 border-transparent rounded-[10px] confirm-btn"
        >
          {t('modal.createFile.labels.button')}
        </button>
      </div>
    </form>
  );
}

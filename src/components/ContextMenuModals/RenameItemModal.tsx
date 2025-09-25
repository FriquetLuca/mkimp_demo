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
    <form
      onSubmit={handleSubmit}
      style={{
        padding: '0.5rem',
        paddingTop: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '.25rem',
      }}
    >
      <label>
        {t('modal.renameItem.labels.input')}
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border:
              errorName !== null
                ? '1px solid color-mix(in srgb, red 70%, black 30%)'
                : '1px solid #333',
            backgroundColor: 'var(--md-bg-code-color)',
            marginTop: '0.25rem',
            fontSize: '1rem',
          }}
        />
      </label>

      <div
        style={{ display: 'flex', alignContent: 'center', height: '1.25rem' }}
      >
        {errorName && (
          <p
            style={{
              color: 'color-mix(in srgb, red 70%, black 30%)',
              fontSize: '0.9rem',
            }}
          >
            ⚠️ {errorName}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button
          type="submit"
          className="confirm-btn"
          style={{
            padding: '0.5rem 1.2rem',
            borderColor: 'transparent',
            borderRadius: '10px',
          }}
        >
          {t('modal.renameItem.labels.button')}
        </button>
      </div>
    </form>
  );
}

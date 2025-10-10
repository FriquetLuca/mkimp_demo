import { z } from 'zod';
import type {
  DirectoryEntry,
  DirectoryItem,
  FileEntry,
} from '../types/fileExplorer';

// Define FileEntry schema
const FileEntrySchema: z.ZodType<FileEntry> = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(),
});

// Define DirectoryEntry schema (recursive)
const DirectoryEntrySchema: z.ZodType<DirectoryEntry> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    nodes: DirectoryItemSchema.array(),
  })
);

// DirectoryItem is a union of DirectoryEntry or FileEntry
const DirectoryItemSchema: z.ZodType<DirectoryItem> = z.lazy(() =>
  z.union([FileEntrySchema, DirectoryEntrySchema])
);

// Schema for the entire JSON file: an array of DirectoryItem
export const DirectoryItemArraySchema = DirectoryItemSchema.array();

import fs from 'fs';

export const fileToUrl = (file?: Express.Multer.File) => (file ? `/upload/${file.filename}` : undefined);

export const getFieldFiles = (files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined, field: string) => {
  if (!files) return [];
  if (Array.isArray(files)) return files.filter((file) => file.fieldname === field);
  return files[field] ?? [];
};

export const parseStringArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(parseStringArray);
  if (typeof value !== 'string') return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === 'string') : [];
    } catch {
      return [];
    }
  }

  return trimmed.includes(',')
    ? trimmed.split(',').map((entry) => entry.trim()).filter(Boolean)
    : [trimmed];
};

export const parseOptionalNumber = (value: unknown) => {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const parseOptionalBoolean = (value: unknown) => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return false;
  return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
};

export const cleanupUploadedFiles = (files: Express.Multer.File[]) => {
  for (const file of files) {
    fs.unlink(file.path, () => undefined);
  }
};

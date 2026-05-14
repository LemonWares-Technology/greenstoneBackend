import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { AppError } from '../utils/AppError';

export const uploadDir = path.join(process.cwd(), 'upload');
export const maxImageUploadSize = 10 * 1024 * 1024;

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeBaseName = path
      .parse(file.originalname)
      .name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'image';
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${safeBaseName}${extension}`);
  },
});

export const imageUpload = multer({
  storage,
  limits: {
    fileSize: maxImageUploadSize,
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new AppError('Only image files are allowed.', 400));
    }
    cb(null, true);
  },
});

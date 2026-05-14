import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { AppError } from '../utils/AppError';
import { maxImageUploadSize } from '../middlewares/upload.middleware';

export const uploadImage = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new AppError('Image file is required. Use multipart field name "image".', 400);
    }

    const fileUrl = `/upload/${req.file.filename}`;

    res.status(201).json({
      success: true,
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        maxSize: maxImageUploadSize,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleUploadError = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError('Image must not be larger than 10 MB.', 400));
    }
    return next(new AppError(err.message, 400));
  }

  next(err);
};

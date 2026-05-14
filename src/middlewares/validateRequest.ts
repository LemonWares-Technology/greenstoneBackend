import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { cleanupUploadedFiles } from '../utils/uploadHelpers';

const getUploadedFiles = (req: Request) => {
  const files: Express.Multer.File[] = [];
  if (req.file) files.push(req.file);
  if (Array.isArray(req.files)) files.push(...req.files);
  if (req.files && !Array.isArray(req.files)) {
    files.push(...Object.values(req.files).flat());
  }
  return files;
};

export const validateRequest =
  (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        cleanupUploadedFiles(getUploadedFiles(req));

        // Format Zod errors
        const errors = error.issues.map((e: any) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
      }
      return next(error);
    }
  };

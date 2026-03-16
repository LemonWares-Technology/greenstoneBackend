import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { handlePrismaError } from '../utils/prismaErrorHandler';

// GET /api/gallery
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gallery = await prisma.gallery.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: gallery });
  } catch (error) {
    next(error);
  }
};

// GET /api/gallery/:id
export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const image = await prisma.gallery.findUnique({ where: { id: req.params.id as string } });
    if (!image) throw new AppError('Gallery image not found.', 404);
    res.json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
};

// POST /api/gallery (protected)
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url, title, category, order } = req.body;
    const image = await prisma.gallery.create({
      data: { url, title, category, order: order ?? 0 },
    });
    res.status(201).json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
};

// PUT /api/gallery/:id (protected)
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url, title, category, order } = req.body;
    const image = await prisma.gallery.update({
      where: { id: req.params.id as string },
      data: { url, title, category, order },
    });
    res.json({ success: true, data: image });
  } catch (error) {
    handlePrismaError(error, 'Gallery image');
  }
};

// DELETE /api/gallery/:id (protected)
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.gallery.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Gallery image deleted.' });
  } catch (error) {
    handlePrismaError(error, 'Gallery image');
  }
};

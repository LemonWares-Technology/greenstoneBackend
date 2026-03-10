import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { handlePrismaError } from '../utils/prismaErrorHandler';

// GET /api/executive-summary
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await prisma.executiveSummary.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

// POST /api/executive-summary (protected)
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { project, loc, status, val, order } = req.body;
    const item = await prisma.executiveSummary.create({
      data: { project, loc, status, val, order: order || 0 },
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// PUT /api/executive-summary/:id (protected)
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { project, loc, status, val, order } = req.body;
    const item = await prisma.executiveSummary.update({
      where: { id: req.params.id as string },
      data: { project, loc, status, val, order },
    });
    res.json({ success: true, data: item });
  } catch (error) {
    handlePrismaError(error, 'Executive summary item');
  }
};

// DELETE /api/executive-summary/:id (protected)
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.executiveSummary.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Executive summary item deleted.' });
  } catch (error) {
    handlePrismaError(error, 'Executive summary item');
  }
};

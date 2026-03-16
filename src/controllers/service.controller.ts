import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { handlePrismaError } from '../utils/prismaErrorHandler';

// GET /api/services
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
};

// GET /api/services/:id
export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await prisma.service.findUnique({ where: { id: req.params.id as string } });
    if (!service) throw new AppError('Service not found.', 404);
    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// POST /api/services (protected)
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, icon, image, highlights, order } = req.body;
    const service = await prisma.service.create({
      data: { title, description, icon: icon ?? 'Building2', image, highlights: highlights ?? [], order: order ?? 0 },
    });
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// PUT /api/services/:id (protected)
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, icon, image, highlights, order } = req.body;
    const service = await prisma.service.update({
      where: { id: req.params.id as string },
      data: { title, description, icon, image, highlights, order },
    });
    res.json({ success: true, data: service });
  } catch (error) {
    handlePrismaError(error, 'Service');
  }
};

// DELETE /api/services/:id (protected)
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Service deleted.' });
  } catch (error) {
    handlePrismaError(error, 'Service');
  }
};

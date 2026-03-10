import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { handlePrismaError } from '../utils/prismaErrorHandler';

// GET /api/team
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const members = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: members });
  } catch (error) {
    next(error);
  }
};

// GET /api/team/:id
export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const member = await prisma.teamMember.findUnique({ where: { id: req.params.id as string } });
    if (!member) throw new AppError('Team member not found.', 404);
    res.json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

// POST /api/team (protected)
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, role, bio, order } = req.body;
    const member = await prisma.teamMember.create({
      data: { name, role, bio, order: order || 0 },
    });
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

// PUT /api/team/:id (protected)
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, role, bio, order } = req.body;
    const member = await prisma.teamMember.update({
      where: { id: req.params.id as string },
      data: { name, role, bio, order },
    });
    res.json({ success: true, data: member });
  } catch (error) {
    handlePrismaError(error, 'Team member');
  }
};

// DELETE /api/team/:id (protected)
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.teamMember.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Team member deleted.' });
  } catch (error) {
    handlePrismaError(error, 'Team member');
  }
};

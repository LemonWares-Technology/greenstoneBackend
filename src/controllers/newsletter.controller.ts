import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { handlePrismaError } from '../utils/prismaErrorHandler';

// GET /api/newsletters
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscribers = await prisma.newsletter.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: subscribers, count: subscribers.length });
  } catch (error) {
    next(error);
  }
};

// POST /api/newsletters (public — subscribe)
export const subscribe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError('Email is required.', 400);
    }

    const existing = await prisma.newsletter.findUnique({ where: { email } });
    if (existing) {
      return res.status(200).json({ success: true, message: 'You are already subscribed!' });
    }

    await prisma.newsletter.create({ data: { email } });
    res.status(201).json({ success: true, message: 'Successfully subscribed to newsletter!' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/newsletters/:id (protected — unsubscribe by admin)
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.newsletter.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Subscriber removed.' });
  } catch (error) {
    handlePrismaError(error, 'Subscriber');
  }
};

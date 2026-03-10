import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { handlePrismaError } from '../utils/prismaErrorHandler';

// GET /api/leads
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: leads });
  } catch (error) {
    next(error);
  }
};

// POST /api/leads (public — contact form)
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const lead = await prisma.lead.create({
      data: { name, email, phone, subject, message },
    });
    res.status(201).json({ success: true, data: lead, message: 'Thank you! We will get back to you shortly.' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/leads/:id (protected)
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.lead.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Lead deleted.' });
  } catch (error) {
    handlePrismaError(error, 'Lead');
  }
};

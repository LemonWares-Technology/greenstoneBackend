import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { handlePrismaError } from '../utils/prismaErrorHandler';
import { teamStatusValues, type TeamStatus } from '../schemas';

const DEFAULT_STATUS: TeamStatus = 'PUBLISHED';

const isTeamStatus = (value: unknown): value is TeamStatus =>
  typeof value === 'string' && (teamStatusValues as readonly string[]).includes(value);

// GET /api/team — public: published members only
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const members = await prisma.teamMember.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
    });
    res.json({ success: true, data: members });
  } catch (error) {
    next(error);
  }
};

// GET /api/team/admin (protected) — every member, drafts included.
// Optional ?status=DRAFT|PUBLISHED narrows the list.
export const getAllAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    if (status !== undefined && !isTeamStatus(status)) {
      throw new AppError('Status must be either DRAFT or PUBLISHED.', 400);
    }
    const members = await prisma.teamMember.findMany({
      where: status ? { status } : undefined,
      orderBy: { order: 'asc' },
    });
    res.json({ success: true, data: members });
  } catch (error) {
    next(error);
  }
};

// GET /api/team/:id — public: drafts are treated as non-existent
export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const member = await prisma.teamMember.findUnique({ where: { id: req.params.id as string } });
    if (!member || member.status !== 'PUBLISHED') throw new AppError('Team member not found.', 404);
    res.json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

// GET /api/team/admin/:id (protected) — drafts included
export const getOneAdmin = async (req: Request, res: Response, next: NextFunction) => {
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
    const { name, role, bio, order, status } = req.body;
    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        bio,
        order: order || 0,
        status: isTeamStatus(status) ? status : DEFAULT_STATUS,
      },
    });
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

// PUT /api/team/:id (protected)
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, role, bio, order, status } = req.body;
    if (status !== undefined && !isTeamStatus(status)) {
      throw new AppError('Status must be either DRAFT or PUBLISHED.', 400);
    }
    const member = await prisma.teamMember.update({
      where: { id: req.params.id as string },
      data: { name, role, bio, order, status },
    });
    res.json({ success: true, data: member });
  } catch (error) {
    handlePrismaError(error, 'Team member');
  }
};

// PATCH /api/team/:id/status (protected) — publish a draft or send one back to draft
export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const member = await prisma.teamMember.update({
      where: { id: req.params.id as string },
      data: { status },
    });
    res.json({
      success: true,
      message: status === 'PUBLISHED' ? 'Team member published.' : 'Team member moved to draft.',
      data: member,
    });
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

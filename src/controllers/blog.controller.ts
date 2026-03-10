import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { handlePrismaError } from '../utils/prismaErrorHandler';

// GET /api/blogs
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blogs = await prisma.blog.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: blogs });
  } catch (error) {
    next(error);
  }
};

// GET /api/blogs/:id
export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await prisma.blog.findUnique({ where: { id: req.params.id as string } });
    if (!blog) throw new AppError('Blog post not found.', 404);
    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// POST /api/blogs (protected)
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, author, role, image, tags, excerpt, content } = req.body;
    const blog = await prisma.blog.create({
      data: { title, author, role, image, tags: tags || [], excerpt, content },
    });
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// PUT /api/blogs/:id (protected)
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, author, role, image, tags, excerpt, content } = req.body;
    const blog = await prisma.blog.update({
      where: { id: req.params.id as string },
      data: { title, author, role, image, tags, excerpt, content },
    });
    res.json({ success: true, data: blog });
  } catch (error) {
    handlePrismaError(error, 'Blog post');
  }
};

// DELETE /api/blogs/:id (protected)
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.blog.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Blog post deleted.' });
  } catch (error) {
    handlePrismaError(error, 'Blog post');
  }
};

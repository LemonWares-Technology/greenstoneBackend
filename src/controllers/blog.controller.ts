import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { handlePrismaError } from '../utils/prismaErrorHandler';
import { sendBlogToSubscribers } from '../services/mail.service';
import { cleanupUploadedFiles, fileToUrl, parseOptionalBoolean, parseStringArray } from '../utils/uploadHelpers';

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
    const { title, author, role, image, tags, excerpt, content, sendNewsletter } = req.body;
    const imageUrl = fileToUrl(req.file) ?? image;
    if (!imageUrl) throw new AppError('Image file or URL is required.', 400);

    const blog = await prisma.blog.create({
      data: { title, author, role, image: imageUrl, tags: parseStringArray(tags), excerpt, content },
    });

    let newsletterResult = null;
    if (parseOptionalBoolean(sendNewsletter)) {
      const subscribers = await prisma.newsletter.findMany({ select: { email: true } });
      const emails = subscribers.map((s) => s.email);
      newsletterResult = await sendBlogToSubscribers(blog, emails).catch((err) => {
        console.error('Newsletter send failed:', err);
        return { sent: 0, failed: emails.length, skipped: false };
      });
    }

    res.status(201).json({
      success: true,
      data: blog,
      message: newsletterResult
        ? `Blog published! Newsletter sent to ${newsletterResult.sent} subscriber(s).`
        : 'Blog post published!',
    });
  } catch (error) {
    if (req.file) cleanupUploadedFiles([req.file]);
    next(error);
  }
};

// PUT /api/blogs/:id (protected)
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, author, role, image, tags, excerpt, content } = req.body;
    const imageUrl = fileToUrl(req.file) ?? image;
    const blog = await prisma.blog.update({
      where: { id: req.params.id as string },
      data: {
        title,
        author,
        role,
        image: imageUrl,
        tags: tags === undefined ? undefined : parseStringArray(tags),
        excerpt,
        content,
      },
    });
    res.json({ success: true, data: blog });
  } catch (error) {
    if (req.file) cleanupUploadedFiles([req.file]);
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

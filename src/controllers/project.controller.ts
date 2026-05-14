import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { handlePrismaError } from '../utils/prismaErrorHandler';
import { cleanupUploadedFiles, fileToUrl, getFieldFiles, parseStringArray } from '../utils/uploadHelpers';

// GET /api/projects
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:id
export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id as string } });
    if (!project) throw new AppError('Project not found.', 404);
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// POST /api/projects (protected)
export const create = async (req: Request, res: Response, next: NextFunction) => {
  const uploadedFiles = [
    ...getFieldFiles(req.files, 'image'),
    ...getFieldFiles(req.files, 'gallery'),
  ];

  try {
    const { name, location, description, status, value, image, gallery } = req.body;
    const mainImage = fileToUrl(getFieldFiles(req.files, 'image')[0]) ?? image;
    const galleryImages = [
      ...parseStringArray(gallery),
      ...getFieldFiles(req.files, 'gallery').map((file) => fileToUrl(file)).filter((url): url is string => Boolean(url)),
    ];

    if (!mainImage) throw new AppError('Image file or URL is required.', 400);

    const project = await prisma.project.create({
      data: { name, location, description, status, value, image: mainImage, gallery: galleryImages },
    });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    cleanupUploadedFiles(uploadedFiles);
    next(error);
  }
};

// PUT /api/projects/:id (protected)
export const update = async (req: Request, res: Response, next: NextFunction) => {
  const uploadedFiles = [
    ...getFieldFiles(req.files, 'image'),
    ...getFieldFiles(req.files, 'gallery'),
  ];

  try {
    const { name, location, description, status, value, image, gallery } = req.body;
    const mainImage = fileToUrl(getFieldFiles(req.files, 'image')[0]) ?? image;
    const uploadedGallery = getFieldFiles(req.files, 'gallery').map((file) => fileToUrl(file)).filter((url): url is string => Boolean(url));
    const galleryImages = gallery === undefined && uploadedGallery.length === 0
      ? undefined
      : [...parseStringArray(gallery), ...uploadedGallery];

    const project = await prisma.project.update({
      where: { id: req.params.id as string },
      data: { name, location, description, status, value, image: mainImage, gallery: galleryImages },
    });
    res.json({ success: true, data: project });
  } catch (error) {
    cleanupUploadedFiles(uploadedFiles);
    handlePrismaError(error, 'Project');
  }
};

// DELETE /api/projects/:id (protected)
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Project deleted.' });
  } catch (error) {
    handlePrismaError(error, 'Project');
  }
};

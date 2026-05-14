"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getOne = exports.getAll = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const AppError_1 = require("../utils/AppError");
const prismaErrorHandler_1 = require("../utils/prismaErrorHandler");
const uploadHelpers_1 = require("../utils/uploadHelpers");
// GET /api/projects
const getAll = async (req, res, next) => {
    try {
        const projects = await prisma_1.default.project.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: projects });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
// GET /api/projects/:id
const getOne = async (req, res, next) => {
    try {
        const project = await prisma_1.default.project.findUnique({ where: { id: req.params.id } });
        if (!project)
            throw new AppError_1.AppError('Project not found.', 404);
        res.json({ success: true, data: project });
    }
    catch (error) {
        next(error);
    }
};
exports.getOne = getOne;
// POST /api/projects (protected)
const create = async (req, res, next) => {
    const uploadedFiles = [
        ...(0, uploadHelpers_1.getFieldFiles)(req.files, 'image'),
        ...(0, uploadHelpers_1.getFieldFiles)(req.files, 'gallery'),
    ];
    try {
        const { name, location, description, status, value, image, gallery } = req.body;
        const mainImage = (0, uploadHelpers_1.fileToUrl)((0, uploadHelpers_1.getFieldFiles)(req.files, 'image')[0]) ?? image;
        const galleryImages = [
            ...(0, uploadHelpers_1.parseStringArray)(gallery),
            ...(0, uploadHelpers_1.getFieldFiles)(req.files, 'gallery').map((file) => (0, uploadHelpers_1.fileToUrl)(file)).filter((url) => Boolean(url)),
        ];
        if (!mainImage)
            throw new AppError_1.AppError('Image file or URL is required.', 400);
        const project = await prisma_1.default.project.create({
            data: { name, location, description, status, value, image: mainImage, gallery: galleryImages },
        });
        res.status(201).json({ success: true, data: project });
    }
    catch (error) {
        (0, uploadHelpers_1.cleanupUploadedFiles)(uploadedFiles);
        next(error);
    }
};
exports.create = create;
// PUT /api/projects/:id (protected)
const update = async (req, res, next) => {
    const uploadedFiles = [
        ...(0, uploadHelpers_1.getFieldFiles)(req.files, 'image'),
        ...(0, uploadHelpers_1.getFieldFiles)(req.files, 'gallery'),
    ];
    try {
        const { name, location, description, status, value, image, gallery } = req.body;
        const mainImage = (0, uploadHelpers_1.fileToUrl)((0, uploadHelpers_1.getFieldFiles)(req.files, 'image')[0]) ?? image;
        const uploadedGallery = (0, uploadHelpers_1.getFieldFiles)(req.files, 'gallery').map((file) => (0, uploadHelpers_1.fileToUrl)(file)).filter((url) => Boolean(url));
        const galleryImages = gallery === undefined && uploadedGallery.length === 0
            ? undefined
            : [...(0, uploadHelpers_1.parseStringArray)(gallery), ...uploadedGallery];
        const project = await prisma_1.default.project.update({
            where: { id: req.params.id },
            data: { name, location, description, status, value, image: mainImage, gallery: galleryImages },
        });
        res.json({ success: true, data: project });
    }
    catch (error) {
        (0, uploadHelpers_1.cleanupUploadedFiles)(uploadedFiles);
        (0, prismaErrorHandler_1.handlePrismaError)(error, 'Project');
    }
};
exports.update = update;
// DELETE /api/projects/:id (protected)
const remove = async (req, res, next) => {
    try {
        await prisma_1.default.project.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Project deleted.' });
    }
    catch (error) {
        (0, prismaErrorHandler_1.handlePrismaError)(error, 'Project');
    }
};
exports.remove = remove;

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
// GET /api/gallery
const getAll = async (req, res, next) => {
    try {
        const gallery = await prisma_1.default.gallery.findMany({ orderBy: { order: 'asc' } });
        res.json({ success: true, data: gallery });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
// GET /api/gallery/:id
const getOne = async (req, res, next) => {
    try {
        const image = await prisma_1.default.gallery.findUnique({ where: { id: req.params.id } });
        if (!image)
            throw new AppError_1.AppError('Gallery image not found.', 404);
        res.json({ success: true, data: image });
    }
    catch (error) {
        next(error);
    }
};
exports.getOne = getOne;
// POST /api/gallery (protected)
const create = async (req, res, next) => {
    try {
        const { url, title, category, order } = req.body;
        const imageUrl = (0, uploadHelpers_1.fileToUrl)(req.file) ?? url;
        if (!imageUrl)
            throw new AppError_1.AppError('Image file or URL is required.', 400);
        const image = await prisma_1.default.gallery.create({
            data: { url: imageUrl, title, category, order: (0, uploadHelpers_1.parseOptionalNumber)(order) ?? 0 },
        });
        res.status(201).json({ success: true, data: image });
    }
    catch (error) {
        if (req.file)
            (0, uploadHelpers_1.cleanupUploadedFiles)([req.file]);
        next(error);
    }
};
exports.create = create;
// PUT /api/gallery/:id (protected)
const update = async (req, res, next) => {
    try {
        const { url, title, category, order } = req.body;
        const imageUrl = (0, uploadHelpers_1.fileToUrl)(req.file) ?? url;
        const image = await prisma_1.default.gallery.update({
            where: { id: req.params.id },
            data: { url: imageUrl, title, category, order: (0, uploadHelpers_1.parseOptionalNumber)(order) },
        });
        res.json({ success: true, data: image });
    }
    catch (error) {
        if (req.file)
            (0, uploadHelpers_1.cleanupUploadedFiles)([req.file]);
        (0, prismaErrorHandler_1.handlePrismaError)(error, 'Gallery image');
    }
};
exports.update = update;
// DELETE /api/gallery/:id (protected)
const remove = async (req, res, next) => {
    try {
        await prisma_1.default.gallery.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Gallery image deleted.' });
    }
    catch (error) {
        (0, prismaErrorHandler_1.handlePrismaError)(error, 'Gallery image');
    }
};
exports.remove = remove;

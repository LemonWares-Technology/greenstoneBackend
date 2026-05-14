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
// GET /api/services
const getAll = async (req, res, next) => {
    try {
        const services = await prisma_1.default.service.findMany({ orderBy: { order: 'asc' } });
        res.json({ success: true, data: services });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
// GET /api/services/:id
const getOne = async (req, res, next) => {
    try {
        const service = await prisma_1.default.service.findUnique({ where: { id: req.params.id } });
        if (!service)
            throw new AppError_1.AppError('Service not found.', 404);
        res.json({ success: true, data: service });
    }
    catch (error) {
        next(error);
    }
};
exports.getOne = getOne;
// POST /api/services (protected)
const create = async (req, res, next) => {
    try {
        const { title, description, icon, image, highlights, order } = req.body;
        const imageUrl = (0, uploadHelpers_1.fileToUrl)(req.file) ?? image;
        const service = await prisma_1.default.service.create({
            data: {
                title,
                description,
                icon: icon ?? 'Building2',
                image: imageUrl,
                highlights: (0, uploadHelpers_1.parseStringArray)(highlights),
                order: (0, uploadHelpers_1.parseOptionalNumber)(order) ?? 0,
            },
        });
        res.status(201).json({ success: true, data: service });
    }
    catch (error) {
        if (req.file)
            (0, uploadHelpers_1.cleanupUploadedFiles)([req.file]);
        next(error);
    }
};
exports.create = create;
// PUT /api/services/:id (protected)
const update = async (req, res, next) => {
    try {
        const { title, description, icon, image, highlights, order } = req.body;
        const imageUrl = (0, uploadHelpers_1.fileToUrl)(req.file) ?? image;
        const service = await prisma_1.default.service.update({
            where: { id: req.params.id },
            data: {
                title,
                description,
                icon,
                image: imageUrl,
                highlights: highlights === undefined ? undefined : (0, uploadHelpers_1.parseStringArray)(highlights),
                order: (0, uploadHelpers_1.parseOptionalNumber)(order),
            },
        });
        res.json({ success: true, data: service });
    }
    catch (error) {
        if (req.file)
            (0, uploadHelpers_1.cleanupUploadedFiles)([req.file]);
        (0, prismaErrorHandler_1.handlePrismaError)(error, 'Service');
    }
};
exports.update = update;
// DELETE /api/services/:id (protected)
const remove = async (req, res, next) => {
    try {
        await prisma_1.default.service.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Service deleted.' });
    }
    catch (error) {
        (0, prismaErrorHandler_1.handlePrismaError)(error, 'Service');
    }
};
exports.remove = remove;

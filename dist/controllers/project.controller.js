"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getOne = exports.getAll = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const AppError_1 = require("../utils/AppError");
const prismaErrorHandler_1 = require("../utils/prismaErrorHandler");
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
    try {
        const { name, location, description, status, value, image, gallery } = req.body;
        const project = await prisma_1.default.project.create({
            data: { name, location, description, status, value, image, gallery: gallery || [] },
        });
        res.status(201).json({ success: true, data: project });
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
// PUT /api/projects/:id (protected)
const update = async (req, res, next) => {
    try {
        const { name, location, description, status, value, image, gallery } = req.body;
        const project = await prisma_1.default.project.update({
            where: { id: req.params.id },
            data: { name, location, description, status, value, image, gallery },
        });
        res.json({ success: true, data: project });
    }
    catch (error) {
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

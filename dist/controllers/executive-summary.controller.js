"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getAll = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const prismaErrorHandler_1 = require("../utils/prismaErrorHandler");
// GET /api/executive-summary
const getAll = async (req, res, next) => {
    try {
        const items = await prisma_1.default.executiveSummary.findMany({ orderBy: { order: 'asc' } });
        res.json({ success: true, data: items });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
// POST /api/executive-summary (protected)
const create = async (req, res, next) => {
    try {
        const { project, loc, status, val, order } = req.body;
        const item = await prisma_1.default.executiveSummary.create({
            data: { project, loc, status, val, order: order || 0 },
        });
        res.status(201).json({ success: true, data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
// PUT /api/executive-summary/:id (protected)
const update = async (req, res, next) => {
    try {
        const { project, loc, status, val, order } = req.body;
        const item = await prisma_1.default.executiveSummary.update({
            where: { id: req.params.id },
            data: { project, loc, status, val, order },
        });
        res.json({ success: true, data: item });
    }
    catch (error) {
        (0, prismaErrorHandler_1.handlePrismaError)(error, 'Executive summary item');
    }
};
exports.update = update;
// DELETE /api/executive-summary/:id (protected)
const remove = async (req, res, next) => {
    try {
        await prisma_1.default.executiveSummary.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Executive summary item deleted.' });
    }
    catch (error) {
        (0, prismaErrorHandler_1.handlePrismaError)(error, 'Executive summary item');
    }
};
exports.remove = remove;

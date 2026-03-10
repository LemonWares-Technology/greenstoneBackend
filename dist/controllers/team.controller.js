"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getOne = exports.getAll = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const AppError_1 = require("../utils/AppError");
const prismaErrorHandler_1 = require("../utils/prismaErrorHandler");
// GET /api/team
const getAll = async (req, res, next) => {
    try {
        const members = await prisma_1.default.teamMember.findMany({ orderBy: { order: 'asc' } });
        res.json({ success: true, data: members });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
// GET /api/team/:id
const getOne = async (req, res, next) => {
    try {
        const member = await prisma_1.default.teamMember.findUnique({ where: { id: req.params.id } });
        if (!member)
            throw new AppError_1.AppError('Team member not found.', 404);
        res.json({ success: true, data: member });
    }
    catch (error) {
        next(error);
    }
};
exports.getOne = getOne;
// POST /api/team (protected)
const create = async (req, res, next) => {
    try {
        const { name, role, bio, order } = req.body;
        const member = await prisma_1.default.teamMember.create({
            data: { name, role, bio, order: order || 0 },
        });
        res.status(201).json({ success: true, data: member });
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
// PUT /api/team/:id (protected)
const update = async (req, res, next) => {
    try {
        const { name, role, bio, order } = req.body;
        const member = await prisma_1.default.teamMember.update({
            where: { id: req.params.id },
            data: { name, role, bio, order },
        });
        res.json({ success: true, data: member });
    }
    catch (error) {
        (0, prismaErrorHandler_1.handlePrismaError)(error, 'Team member');
    }
};
exports.update = update;
// DELETE /api/team/:id (protected)
const remove = async (req, res, next) => {
    try {
        await prisma_1.default.teamMember.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Team member deleted.' });
    }
    catch (error) {
        (0, prismaErrorHandler_1.handlePrismaError)(error, 'Team member');
    }
};
exports.remove = remove;

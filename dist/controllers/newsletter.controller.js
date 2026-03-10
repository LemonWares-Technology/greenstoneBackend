"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.subscribe = exports.getAll = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const AppError_1 = require("../utils/AppError");
const prismaErrorHandler_1 = require("../utils/prismaErrorHandler");
// GET /api/newsletters
const getAll = async (req, res, next) => {
    try {
        const subscribers = await prisma_1.default.newsletter.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: subscribers, count: subscribers.length });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
// POST /api/newsletters (public — subscribe)
const subscribe = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw new AppError_1.AppError('Email is required.', 400);
        }
        const existing = await prisma_1.default.newsletter.findUnique({ where: { email } });
        if (existing) {
            return res.status(200).json({ success: true, message: 'You are already subscribed!' });
        }
        await prisma_1.default.newsletter.create({ data: { email } });
        res.status(201).json({ success: true, message: 'Successfully subscribed to newsletter!' });
    }
    catch (error) {
        next(error);
    }
};
exports.subscribe = subscribe;
// DELETE /api/newsletters/:id (protected — unsubscribe by admin)
const remove = async (req, res, next) => {
    try {
        await prisma_1.default.newsletter.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Subscriber removed.' });
    }
    catch (error) {
        (0, prismaErrorHandler_1.handlePrismaError)(error, 'Subscriber');
    }
};
exports.remove = remove;

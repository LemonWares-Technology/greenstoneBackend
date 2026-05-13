"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.create = exports.getAll = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const prismaErrorHandler_1 = require("../utils/prismaErrorHandler");
const mail_service_1 = require("../services/mail.service");
// GET /api/leads
const getAll = async (req, res, next) => {
    try {
        const leads = await prisma_1.default.lead.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: leads });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
// POST /api/leads (public — contact form)
const create = async (req, res, next) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        const lead = await prisma_1.default.lead.create({
            data: { name, email, phone, subject, message },
        });
        // Fire-and-forget: notify admin(s) via email
        (0, mail_service_1.notifyAdminsOfLead)(lead).catch((err) => console.error('Failed to send lead notification email:', err));
        res.status(201).json({ success: true, data: lead, message: 'Thank you! We will get back to you shortly.' });
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
// DELETE /api/leads/:id (protected)
const remove = async (req, res, next) => {
    try {
        await prisma_1.default.lead.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Lead deleted.' });
    }
    catch (error) {
        (0, prismaErrorHandler_1.handlePrismaError)(error, 'Lead');
    }
};
exports.remove = remove;

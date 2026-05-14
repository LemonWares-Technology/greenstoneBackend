"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getOne = exports.getAll = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const AppError_1 = require("../utils/AppError");
const prismaErrorHandler_1 = require("../utils/prismaErrorHandler");
const mail_service_1 = require("../services/mail.service");
const uploadHelpers_1 = require("../utils/uploadHelpers");
// GET /api/blogs
const getAll = async (req, res, next) => {
    try {
        const blogs = await prisma_1.default.blog.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: blogs });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
// GET /api/blogs/:id
const getOne = async (req, res, next) => {
    try {
        const blog = await prisma_1.default.blog.findUnique({ where: { id: req.params.id } });
        if (!blog)
            throw new AppError_1.AppError('Blog post not found.', 404);
        res.json({ success: true, data: blog });
    }
    catch (error) {
        next(error);
    }
};
exports.getOne = getOne;
// POST /api/blogs (protected)
const create = async (req, res, next) => {
    try {
        const { title, author, role, image, tags, excerpt, content, sendNewsletter } = req.body;
        const imageUrl = (0, uploadHelpers_1.fileToUrl)(req.file) ?? image;
        if (!imageUrl)
            throw new AppError_1.AppError('Image file or URL is required.', 400);
        const blog = await prisma_1.default.blog.create({
            data: { title, author, role, image: imageUrl, tags: (0, uploadHelpers_1.parseStringArray)(tags), excerpt, content },
        });
        let newsletterResult = null;
        if ((0, uploadHelpers_1.parseOptionalBoolean)(sendNewsletter)) {
            const subscribers = await prisma_1.default.newsletter.findMany({ select: { email: true } });
            const emails = subscribers.map((s) => s.email);
            newsletterResult = await (0, mail_service_1.sendBlogToSubscribers)(blog, emails).catch((err) => {
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
    }
    catch (error) {
        if (req.file)
            (0, uploadHelpers_1.cleanupUploadedFiles)([req.file]);
        next(error);
    }
};
exports.create = create;
// PUT /api/blogs/:id (protected)
const update = async (req, res, next) => {
    try {
        const { title, author, role, image, tags, excerpt, content } = req.body;
        const imageUrl = (0, uploadHelpers_1.fileToUrl)(req.file) ?? image;
        const blog = await prisma_1.default.blog.update({
            where: { id: req.params.id },
            data: {
                title,
                author,
                role,
                image: imageUrl,
                tags: tags === undefined ? undefined : (0, uploadHelpers_1.parseStringArray)(tags),
                excerpt,
                content,
            },
        });
        res.json({ success: true, data: blog });
    }
    catch (error) {
        if (req.file)
            (0, uploadHelpers_1.cleanupUploadedFiles)([req.file]);
        (0, prismaErrorHandler_1.handlePrismaError)(error, 'Blog post');
    }
};
exports.update = update;
// DELETE /api/blogs/:id (protected)
const remove = async (req, res, next) => {
    try {
        await prisma_1.default.blog.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Blog post deleted.' });
    }
    catch (error) {
        (0, prismaErrorHandler_1.handlePrismaError)(error, 'Blog post');
    }
};
exports.remove = remove;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExecSummarySchema = exports.createServiceSchema = exports.createGallerySchema = exports.subscribeSchema = exports.createLeadSchema = exports.createTeamSchema = exports.createBlogSchema = exports.createProjectSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const numberLike = zod_1.z.union([zod_1.z.number(), zod_1.z.string().regex(/^-?\d+(\.\d+)?$/)]).optional();
const stringArrayLike = zod_1.z.union([zod_1.z.array(zod_1.z.string()), zod_1.z.string()]).optional();
const booleanLike = zod_1.z.union([zod_1.z.boolean(), zod_1.z.string()]).optional();
// ─── Auth ────────────────────────────────────────────────
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
// ─── Project ─────────────────────────────────────────────
exports.createProjectSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Project name is required'),
        location: zod_1.z.string().min(1, 'Location is required'),
        description: zod_1.z.string().min(1, 'Description is required'),
        status: zod_1.z.string().min(1, 'Status is required'),
        value: zod_1.z.string().optional(),
        image: zod_1.z.string().min(1, 'Image is required').optional(),
        gallery: stringArrayLike,
    }),
});
// ─── Blog ────────────────────────────────────────────────
exports.createBlogSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required'),
        author: zod_1.z.string().min(1, 'Author is required'),
        role: zod_1.z.string().min(1, 'Role is required'),
        image: zod_1.z.string().min(1, 'Image is required').optional(),
        tags: stringArrayLike,
        excerpt: zod_1.z.string().min(1, 'Excerpt is required'),
        content: zod_1.z.string().min(1, 'Content is required'),
        sendNewsletter: booleanLike,
    }),
});
// ─── Team ────────────────────────────────────────────────
exports.createTeamSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required'),
        role: zod_1.z.string().min(1, 'Role is required'),
        bio: zod_1.z.string().min(1, 'Bio is required'),
        order: numberLike,
    }),
});
// ─── Lead ────────────────────────────────────────────────
exports.createLeadSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required'),
        email: zod_1.z.string().email('Invalid email address'),
        phone: zod_1.z.string().optional(),
        subject: zod_1.z.string().optional(),
        message: zod_1.z.string().min(1, 'Message is required'),
    }),
});
// ─── Newsletter ──────────────────────────────────────────
exports.subscribeSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
    }),
});
// ─── Gallery ────────────────────────────────────────────
exports.createGallerySchema = zod_1.z.object({
    body: zod_1.z.object({
        url: zod_1.z.string().min(1, 'Image URL is required').optional(),
        title: zod_1.z.string().min(1, 'Title is required'),
        category: zod_1.z.string().min(1, 'Category is required'),
        order: numberLike,
    }),
});
// ─── Service ────────────────────────────────────────────
exports.createServiceSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required'),
        description: zod_1.z.string().min(1, 'Description is required'),
        icon: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
        highlights: stringArrayLike,
        order: numberLike,
    }),
});
// ─── Executive Summary ──────────────────────────────────
exports.createExecSummarySchema = zod_1.z.object({
    body: zod_1.z.object({
        project: zod_1.z.string().min(1, 'Project is required'),
        loc: zod_1.z.string().min(1, 'Location is required'),
        status: zod_1.z.string().min(1, 'Status is required'),
        val: zod_1.z.string().optional(),
        order: numberLike,
    }),
});

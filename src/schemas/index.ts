import { z } from 'zod';

// ─── Auth ────────────────────────────────────────────────
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// ─── Project ─────────────────────────────────────────────
export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Project name is required'),
    location: z.string().min(1, 'Location is required'),
    description: z.string().min(1, 'Description is required'),
    status: z.string().min(1, 'Status is required'),
    value: z.string().optional(),
    image: z.string().min(1, 'Image is required'),
    gallery: z.array(z.string()).optional(),
  }),
});

// ─── Blog ────────────────────────────────────────────────
export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    author: z.string().min(1, 'Author is required'),
    role: z.string().min(1, 'Role is required'),
    image: z.string().min(1, 'Image is required'),
    tags: z.array(z.string()).optional(),
    excerpt: z.string().min(1, 'Excerpt is required'),
    content: z.string().min(1, 'Content is required'),
  }),
});

// ─── Team ────────────────────────────────────────────────
export const createTeamSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    role: z.string().min(1, 'Role is required'),
    bio: z.string().min(1, 'Bio is required'),
    order: z.number().optional(),
  }),
});

// ─── Lead ────────────────────────────────────────────────
export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(1, 'Message is required'),
  }),
});

// ─── Newsletter ──────────────────────────────────────────
export const subscribeSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

// ─── Executive Summary ──────────────────────────────────
export const createExecSummarySchema = z.object({
  body: z.object({
    project: z.string().min(1, 'Project is required'),
    loc: z.string().min(1, 'Location is required'),
    status: z.string().min(1, 'Status is required'),
    val: z.string().optional(),
    order: z.number().optional(),
  }),
});

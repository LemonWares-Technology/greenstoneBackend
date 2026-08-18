import { Router } from 'express';
import { protect, adminOnly } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validateRequest';

// Controllers
import * as auth from '../controllers/auth.controller';
import * as project from '../controllers/project.controller';
import * as blog from '../controllers/blog.controller';
import * as team from '../controllers/team.controller';
import * as lead from '../controllers/lead.controller';
import * as newsletter from '../controllers/newsletter.controller';
import * as execSummary from '../controllers/executive-summary.controller';
import * as gallery from '../controllers/gallery.controller';
import * as service from '../controllers/service.controller';
import * as stats from '../controllers/stats.controller';
import * as upload from '../controllers/upload.controller';
import { imageUpload } from '../middlewares/upload.middleware';

// Validation Schemas
import {
  loginSchema,
  createProjectSchema, createBlogSchema, createTeamSchema, updateTeamStatusSchema,
  createLeadSchema, subscribeSchema, createGallerySchema, createServiceSchema, createExecSummarySchema,
} from '../schemas';

const router = Router();

// ─── Auth ────────────────────────────────────────────────
// Registration is disabled — admin is seeded from .env on startup.
router.post('/auth/login', validateRequest(loginSchema), auth.login);
router.get('/auth/me', protect, auth.getMe);
router.post('/upload', protect, adminOnly, imageUpload.single('image'), upload.handleUploadError, upload.uploadImage);

// ─── Projects ────────────────────────────────────────────
router.get('/projects', project.getAll);                                                        // Public
router.get('/projects/:id', project.getOne);                                                    // Public
router.post('/projects', protect, adminOnly, imageUpload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 20 }]), upload.handleUploadError, validateRequest(createProjectSchema), project.create);
router.put('/projects/:id', protect, adminOnly, imageUpload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 20 }]), upload.handleUploadError, project.update);
router.delete('/projects/:id', protect, adminOnly, project.remove);

// ─── Blogs ───────────────────────────────────────────────
router.get('/blogs', blog.getAll);                                                              // Public
router.get('/blogs/:id', blog.getOne);                                                          // Public
router.post('/blogs', protect, adminOnly, imageUpload.single('image'), upload.handleUploadError, validateRequest(createBlogSchema), blog.create);
router.put('/blogs/:id', protect, adminOnly, imageUpload.single('image'), upload.handleUploadError, blog.update);
router.delete('/blogs/:id', protect, adminOnly, blog.remove);

// ─── Team ────────────────────────────────────────────────
// NOTE: the /team/admin routes must be declared before /team/:id so they are not swallowed by it.
router.get('/team/admin', protect, adminOnly, team.getAllAdmin);                                // Drafts included
router.get('/team/admin/:id', protect, adminOnly, team.getOneAdmin);                            // Drafts included
router.get('/team', team.getAll);                                                               // Public (published only)
router.get('/team/:id', team.getOne);                                                           // Public (published only)
router.post('/team', protect, adminOnly, validateRequest(createTeamSchema), team.create);
router.put('/team/:id', protect, adminOnly, team.update);
router.patch('/team/:id/status', protect, adminOnly, validateRequest(updateTeamStatusSchema), team.updateStatus);
router.delete('/team/:id', protect, adminOnly, team.remove);

// ─── Leads (Contact Form) ───────────────────────────────
router.post('/leads', validateRequest(createLeadSchema), lead.create);                          // Public
router.get('/leads', protect, adminOnly, lead.getAll);
router.delete('/leads/:id', protect, adminOnly, lead.remove);

// ─── Newsletter ─────────────────────────────────────────
router.post('/newsletters', validateRequest(subscribeSchema), newsletter.subscribe);            // Public
router.get('/newsletters', protect, adminOnly, newsletter.getAll);
router.delete('/newsletters/:id', protect, adminOnly, newsletter.remove);

// ─── Gallery ──────────────────────────────────────────────
router.get('/gallery', gallery.getAll);                                                            // Public
router.get('/gallery/:id', gallery.getOne);                                                        // Public
router.post('/gallery', protect, adminOnly, imageUpload.single('image'), upload.handleUploadError, validateRequest(createGallerySchema), gallery.create);
router.put('/gallery/:id', protect, adminOnly, imageUpload.single('image'), upload.handleUploadError, gallery.update);
router.delete('/gallery/:id', protect, adminOnly, gallery.remove);

// ─── Services ─────────────────────────────────────────────
router.get('/services', service.getAll);                                                            // Public
router.get('/services/:id', service.getOne);                                                        // Public
router.post('/services', protect, adminOnly, imageUpload.single('image'), upload.handleUploadError, validateRequest(createServiceSchema), service.create);
router.put('/services/:id', protect, adminOnly, imageUpload.single('image'), upload.handleUploadError, service.update);
router.delete('/services/:id', protect, adminOnly, service.remove);

// ─── Executive Summary ──────────────────────────────────
router.get('/executive-summary', execSummary.getAll);                                           // Public
router.post('/executive-summary', protect, adminOnly, validateRequest(createExecSummarySchema), execSummary.create);
router.put('/executive-summary/:id', protect, adminOnly, execSummary.update);
router.delete('/executive-summary/:id', protect, adminOnly, execSummary.remove);

// ─── Dashboard Stats ────────────────────────────────────
router.get('/stats', protect, adminOnly, stats.getDashboardStats);

export default router;

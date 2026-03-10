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
import * as stats from '../controllers/stats.controller';

// Validation Schemas
import {
  loginSchema,
  createProjectSchema, createBlogSchema, createTeamSchema,
  createLeadSchema, subscribeSchema, createExecSummarySchema,
} from '../schemas';

const router = Router();

// ─── Auth ────────────────────────────────────────────────
// Registration is disabled — admin is seeded from .env on startup.
router.post('/auth/login', validateRequest(loginSchema), auth.login);
router.get('/auth/me', protect, auth.getMe);

// ─── Projects ────────────────────────────────────────────
router.get('/projects', project.getAll);                                                        // Public
router.get('/projects/:id', project.getOne);                                                    // Public
router.post('/projects', protect, adminOnly, validateRequest(createProjectSchema), project.create);
router.put('/projects/:id', protect, adminOnly, project.update);
router.delete('/projects/:id', protect, adminOnly, project.remove);

// ─── Blogs ───────────────────────────────────────────────
router.get('/blogs', blog.getAll);                                                              // Public
router.get('/blogs/:id', blog.getOne);                                                          // Public
router.post('/blogs', protect, adminOnly, validateRequest(createBlogSchema), blog.create);
router.put('/blogs/:id', protect, adminOnly, blog.update);
router.delete('/blogs/:id', protect, adminOnly, blog.remove);

// ─── Team ────────────────────────────────────────────────
router.get('/team', team.getAll);                                                               // Public
router.get('/team/:id', team.getOne);                                                           // Public
router.post('/team', protect, adminOnly, validateRequest(createTeamSchema), team.create);
router.put('/team/:id', protect, adminOnly, team.update);
router.delete('/team/:id', protect, adminOnly, team.remove);

// ─── Leads (Contact Form) ───────────────────────────────
router.post('/leads', validateRequest(createLeadSchema), lead.create);                          // Public
router.get('/leads', protect, adminOnly, lead.getAll);
router.delete('/leads/:id', protect, adminOnly, lead.remove);

// ─── Newsletter ─────────────────────────────────────────
router.post('/newsletters', validateRequest(subscribeSchema), newsletter.subscribe);            // Public
router.get('/newsletters', protect, adminOnly, newsletter.getAll);
router.delete('/newsletters/:id', protect, adminOnly, newsletter.remove);

// ─── Executive Summary ──────────────────────────────────
router.get('/executive-summary', execSummary.getAll);                                           // Public
router.post('/executive-summary', protect, adminOnly, validateRequest(createExecSummarySchema), execSummary.create);
router.put('/executive-summary/:id', protect, adminOnly, execSummary.update);
router.delete('/executive-summary/:id', protect, adminOnly, execSummary.remove);

// ─── Dashboard Stats ────────────────────────────────────
router.get('/stats', protect, adminOnly, stats.getDashboardStats);

export default router;

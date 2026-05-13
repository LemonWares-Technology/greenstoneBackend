"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validateRequest_1 = require("../middlewares/validateRequest");
// Controllers
const auth = __importStar(require("../controllers/auth.controller"));
const project = __importStar(require("../controllers/project.controller"));
const blog = __importStar(require("../controllers/blog.controller"));
const team = __importStar(require("../controllers/team.controller"));
const lead = __importStar(require("../controllers/lead.controller"));
const newsletter = __importStar(require("../controllers/newsletter.controller"));
const execSummary = __importStar(require("../controllers/executive-summary.controller"));
const gallery = __importStar(require("../controllers/gallery.controller"));
const service = __importStar(require("../controllers/service.controller"));
const stats = __importStar(require("../controllers/stats.controller"));
// Validation Schemas
const schemas_1 = require("../schemas");
const router = (0, express_1.Router)();
// ─── Auth ────────────────────────────────────────────────
// Registration is disabled — admin is seeded from .env on startup.
router.post('/auth/login', (0, validateRequest_1.validateRequest)(schemas_1.loginSchema), auth.login);
router.get('/auth/me', auth_middleware_1.protect, auth.getMe);
// ─── Projects ────────────────────────────────────────────
router.get('/projects', project.getAll); // Public
router.get('/projects/:id', project.getOne); // Public
router.post('/projects', auth_middleware_1.protect, auth_middleware_1.adminOnly, (0, validateRequest_1.validateRequest)(schemas_1.createProjectSchema), project.create);
router.put('/projects/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, project.update);
router.delete('/projects/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, project.remove);
// ─── Blogs ───────────────────────────────────────────────
router.get('/blogs', blog.getAll); // Public
router.get('/blogs/:id', blog.getOne); // Public
router.post('/blogs', auth_middleware_1.protect, auth_middleware_1.adminOnly, (0, validateRequest_1.validateRequest)(schemas_1.createBlogSchema), blog.create);
router.put('/blogs/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, blog.update);
router.delete('/blogs/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, blog.remove);
// ─── Team ────────────────────────────────────────────────
router.get('/team', team.getAll); // Public
router.get('/team/:id', team.getOne); // Public
router.post('/team', auth_middleware_1.protect, auth_middleware_1.adminOnly, (0, validateRequest_1.validateRequest)(schemas_1.createTeamSchema), team.create);
router.put('/team/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, team.update);
router.delete('/team/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, team.remove);
// ─── Leads (Contact Form) ───────────────────────────────
router.post('/leads', (0, validateRequest_1.validateRequest)(schemas_1.createLeadSchema), lead.create); // Public
router.get('/leads', auth_middleware_1.protect, auth_middleware_1.adminOnly, lead.getAll);
router.delete('/leads/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, lead.remove);
// ─── Newsletter ─────────────────────────────────────────
router.post('/newsletters', (0, validateRequest_1.validateRequest)(schemas_1.subscribeSchema), newsletter.subscribe); // Public
router.get('/newsletters', auth_middleware_1.protect, auth_middleware_1.adminOnly, newsletter.getAll);
router.delete('/newsletters/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, newsletter.remove);
// ─── Gallery ──────────────────────────────────────────────
router.get('/gallery', gallery.getAll); // Public
router.get('/gallery/:id', gallery.getOne); // Public
router.post('/gallery', auth_middleware_1.protect, auth_middleware_1.adminOnly, (0, validateRequest_1.validateRequest)(schemas_1.createGallerySchema), gallery.create);
router.put('/gallery/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, gallery.update);
router.delete('/gallery/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, gallery.remove);
// ─── Services ─────────────────────────────────────────────
router.get('/services', service.getAll); // Public
router.get('/services/:id', service.getOne); // Public
router.post('/services', auth_middleware_1.protect, auth_middleware_1.adminOnly, (0, validateRequest_1.validateRequest)(schemas_1.createServiceSchema), service.create);
router.put('/services/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, service.update);
router.delete('/services/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, service.remove);
// ─── Executive Summary ──────────────────────────────────
router.get('/executive-summary', execSummary.getAll); // Public
router.post('/executive-summary', auth_middleware_1.protect, auth_middleware_1.adminOnly, (0, validateRequest_1.validateRequest)(schemas_1.createExecSummarySchema), execSummary.create);
router.put('/executive-summary/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, execSummary.update);
router.delete('/executive-summary/:id', auth_middleware_1.protect, auth_middleware_1.adminOnly, execSummary.remove);
// ─── Dashboard Stats ────────────────────────────────────
router.get('/stats', auth_middleware_1.protect, auth_middleware_1.adminOnly, stats.getDashboardStats);
exports.default = router;

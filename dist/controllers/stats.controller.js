"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
// GET /api/stats (protected — admin dashboard)
const getDashboardStats = async (req, res, next) => {
    try {
        const [totalProjects, totalBlogs, totalTeamMembers, totalLeads, totalSubscribers, totalExecutiveSummary, recentLeads, recentSubscribers,] = await Promise.all([
            prisma_1.default.project.count(),
            prisma_1.default.blog.count(),
            prisma_1.default.teamMember.count(),
            prisma_1.default.lead.count(),
            prisma_1.default.newsletter.count(),
            prisma_1.default.executiveSummary.count(),
            prisma_1.default.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
            prisma_1.default.newsletter.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
        ]);
        res.json({
            success: true,
            data: {
                counts: {
                    projects: totalProjects,
                    blogs: totalBlogs,
                    teamMembers: totalTeamMembers,
                    leads: totalLeads,
                    subscribers: totalSubscribers,
                    executiveSummary: totalExecutiveSummary,
                },
                recent: {
                    leads: recentLeads,
                    subscribers: recentSubscribers,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardStats = getDashboardStats;

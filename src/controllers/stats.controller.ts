import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

// GET /api/stats (protected — admin dashboard)
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      totalProjects,
      totalBlogs,
      totalTeamMembers,
      totalLeads,
      totalSubscribers,
      totalExecutiveSummary,
      recentLeads,
      recentSubscribers,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.blog.count(),
      prisma.teamMember.count(),
      prisma.lead.count(),
      prisma.newsletter.count(),
      prisma.executiveSummary.count(),
      prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.newsletter.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
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
  } catch (error) {
    next(error);
  }
};

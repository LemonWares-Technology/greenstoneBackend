"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("./lib/prisma"));
const config_1 = require("./config");
/**
 * Seeds the database with initial data (Admin, Projects, Team, Blogs).
 * Runs on every server start — skips if the data already exists.
 */
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');
        // 1. Seed Admin
        const existingAdmin = await prisma_1.default.user.findUnique({
            where: { email: config_1.config.adminEmail },
        });
        if (!existingAdmin) {
            const hashedPassword = await bcryptjs_1.default.hash(config_1.config.adminPassword, 12);
            await prisma_1.default.user.create({
                data: {
                    name: config_1.config.adminName,
                    email: config_1.config.adminEmail,
                    password: hashedPassword,
                    role: 'ADMIN',
                },
            });
            console.log(`✓ Admin user created: ${config_1.config.adminEmail}`);
        }
        else {
            console.log('✓ Admin user already exists');
        }
        // 2. Seed Team (Engineers)
        const teamCount = await prisma_1.default.teamMember.count();
        if (teamCount === 0) {
            await prisma_1.default.teamMember.createMany({
                data: [
                    {
                        name: 'Engr. Benson Okeke',
                        role: 'Chief Civil Engineer',
                        bio: 'Over 15 years of experience in structural engineering and large-scale residential developments. Led the technical team for Green Court Residence.',
                        order: 1,
                    },
                    {
                        name: 'Archt. Sarah Bello',
                        role: 'Lead Project Architect',
                        bio: 'Specialist in modern sustainable architecture. Winner of the 2023 Nigerian Design Excellence Award. Focuses on blending luxury with functionality.',
                        order: 2,
                    },
                    {
                        name: 'Engr. David Kalu',
                        role: 'Structural Engineer',
                        bio: 'Expert in suspended swimming pool designs and high-rise structural integrity. Ensures all Greenstone projects meet international safety standards.',
                        order: 3,
                    },
                    {
                        name: 'Ms. Chiamaka Eze',
                        role: 'Project Manager',
                        bio: 'Certified PMP with a track record of delivering luxury projects on time and within budget. Coordinates between technical teams and stakeholders.',
                        order: 4,
                    },
                ],
            });
            console.log('✓ Team members seeded');
        }
        // 3. Seed Projects
        const projectCount = await prisma_1.default.project.count();
        if (projectCount === 0) {
            await prisma_1.default.project.createMany({
                data: [
                    {
                        name: 'GREEN COURT RESIDENCE',
                        location: 'Maitama, Abuja',
                        status: '35% Completed',
                        value: 'N 3.9 Billion',
                        description: '4 Units of Ultra-luxury Homes featuring suspended swimming pools and architectural excellence in Abuja\'s most prestigious district.',
                        image: '/assets/project_exterior_1.png',
                        gallery: ['/assets/project_interior_1.png', '/assets/project_interior_2.png'],
                    },
                    {
                        name: 'SOLARIS HEIGHTS',
                        location: 'Ikoyi, Lagos',
                        status: 'Planning Phase',
                        value: 'N 5.2 Billion',
                        description: 'A masterpiece of contemporary design featuring 12 luxury apartments with smart home integration and panoramic ocean views.',
                        image: '/assets/project_exterior_2.png',
                        gallery: [],
                    },
                    {
                        name: 'THE OAK MANOR',
                        location: 'Asokoro, Abuja',
                        status: '70% Completed',
                        value: 'N 2.5 Billion',
                        description: 'Exclusive gated community of 6 detached villas, combining traditional elegance with modern luxury amenities.',
                        image: '/assets/project_exterior_3.png',
                        gallery: ['/assets/project_interior_3.png'],
                    },
                ],
            });
            console.log('✓ Projects seeded');
        }
        // 4. Seed Blogs
        const blogCount = await prisma_1.default.blog.count();
        if (blogCount === 0) {
            await prisma_1.default.blog.createMany({
                data: [
                    {
                        title: 'The Rise of Smart Luxury Homes in Nigeria',
                        author: 'Engr. Benson Okeke',
                        role: 'Chief Civil Engineer',
                        image: '/assets/blog_hero_1.png',
                        tags: ['Technology', 'Luxury', 'Engineering'],
                        excerpt: 'How automation and AI are redefining the meaning of premium living in Abuja and Lagos.',
                        content: '<p>The Nigerian real estate landscape is undergoing a digital revolution. Home automation is no longer just a luxury feature but a core requirement for premium developments...</p>',
                    },
                    {
                        title: 'Sustainable Architecture: Beyond Aesthetics',
                        author: 'Archt. Sarah Bello',
                        role: 'Lead Project Architect',
                        image: '/assets/blog_hero_2.png',
                        tags: ['Design', 'Sustainability'],
                        excerpt: 'Exploring how green building materials and passive cooling are being integrated into luxury residential designs.',
                        content: '<p>Sustainability in luxury real estate is about more than just solar panels. It starts with the orientation of the building and the choice of thermal mass materials...</p>',
                    },
                ],
            });
            console.log('✓ Blog posts seeded');
        }
        // 5. Seed Executive Summaries
        const summaryCount = await prisma_1.default.executiveSummary.count();
        if (summaryCount === 0) {
            await prisma_1.default.executiveSummary.createMany({
                data: [
                    { project: 'Projects Completed', loc: 'Across Nigeria', status: 'Delivered', val: '12+', order: 1 },
                    { project: 'Portfolio Value', loc: 'Lagos & Abuja', status: 'Active', val: 'N 15Bn+', order: 2 },
                    { project: 'Happy Clients', loc: 'Global', status: 'Verified', val: '50+', order: 3 },
                ],
            });
            console.log('✓ Executive summaries seeded');
        }
        console.log('✅ Seeding completed successfully!');
    }
    catch (error) {
        console.error('✗ Failed to seed database:', error);
    }
};
exports.seedDatabase = seedDatabase;
// If run directly (npm run seed)
if (require.main === module) {
    (0, exports.seedDatabase)().then(() => process.exit(0)).catch(() => process.exit(1));
}

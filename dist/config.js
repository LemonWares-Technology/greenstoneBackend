"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
exports.config = {
    port: parseInt(process.env.PORT || '5000', 10),
    jwtSecret: process.env.JWT_SECRET || 'greenstone-super-secret-key-change-me',
    jwtExpiresIn: '7d',
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@greenstoneltd.com',
    adminPassword: process.env.ADMIN_PASSWORD || 'GreenStone@2025!',
    adminName: process.env.ADMIN_NAME || 'Greenstone Admin',
};

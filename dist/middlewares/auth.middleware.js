"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const AppError_1 = require("../utils/AppError");
/**
 * Verifies the JWT token and attaches user info to the request.
 * Any authenticated user (including admin) passes this check.
 */
const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError_1.AppError('Not authorized. No token provided.', 401);
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            return next(error);
        }
        return next(new AppError_1.AppError('Not authorized. Invalid token.', 401));
    }
};
exports.protect = protect;
/**
 * Ensures the authenticated user has the ADMIN role.
 * Must be used AFTER the `protect` middleware.
 */
const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        return next(new AppError_1.AppError('Access denied. Admin privileges required.', 403));
    }
    next();
};
exports.adminOnly = adminOnly;

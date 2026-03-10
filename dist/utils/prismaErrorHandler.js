"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrismaError = void 0;
const AppError_1 = require("./AppError");
/**
 * Wraps Prisma errors (P2025 = record not found) into friendly AppErrors.
 * Use in catch blocks of update/delete operations.
 */
const handlePrismaError = (error, entityName) => {
    if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error;
        if (prismaError.code === 'P2025') {
            throw new AppError_1.AppError(`${entityName} not found.`, 404);
        }
    }
    throw error;
};
exports.handlePrismaError = handlePrismaError;

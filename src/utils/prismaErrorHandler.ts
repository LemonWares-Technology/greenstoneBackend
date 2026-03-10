import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';

/**
 * Wraps Prisma errors (P2025 = record not found) into friendly AppErrors.
 * Use in catch blocks of update/delete operations.
 */
export const handlePrismaError = (error: unknown, entityName: string): never => {
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string };
    if (prismaError.code === 'P2025') {
      throw new AppError(`${entityName} not found.`, 404);
    }
  }
  throw error;
};

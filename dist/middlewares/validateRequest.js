"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const uploadHelpers_1 = require("../utils/uploadHelpers");
const getUploadedFiles = (req) => {
    const files = [];
    if (req.file)
        files.push(req.file);
    if (Array.isArray(req.files))
        files.push(...req.files);
    if (req.files && !Array.isArray(req.files)) {
        files.push(...Object.values(req.files).flat());
    }
    return files;
};
const validateRequest = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            (0, uploadHelpers_1.cleanupUploadedFiles)(getUploadedFiles(req));
            // Format Zod errors
            const errors = error.issues.map((e) => ({
                path: e.path.join('.'),
                message: e.message,
            }));
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors,
            });
        }
        return next(error);
    }
};
exports.validateRequest = validateRequest;

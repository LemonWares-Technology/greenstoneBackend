"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUploadError = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const AppError_1 = require("../utils/AppError");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const uploadImage = (req, res, next) => {
    try {
        if (!req.file) {
            throw new AppError_1.AppError('Image file is required. Use multipart field name "image".', 400);
        }
        const fileUrl = `/upload/${req.file.filename}`;
        res.status(201).json({
            success: true,
            data: {
                url: fileUrl,
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                maxSize: upload_middleware_1.maxImageUploadSize,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadImage = uploadImage;
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new AppError_1.AppError('Image must not be larger than 10 MB.', 400));
        }
        return next(new AppError_1.AppError(err.message, 400));
    }
    next(err);
};
exports.handleUploadError = handleUploadError;

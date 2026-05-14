"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageUpload = exports.maxImageUploadSize = exports.uploadDir = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const AppError_1 = require("../utils/AppError");
exports.uploadDir = path_1.default.join(process.cwd(), 'upload');
exports.maxImageUploadSize = 10 * 1024 * 1024;
const allowedMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
    'image/svg+xml',
]);
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        fs_1.default.mkdirSync(exports.uploadDir, { recursive: true });
        cb(null, exports.uploadDir);
    },
    filename: (req, file, cb) => {
        const safeBaseName = path_1.default
            .parse(file.originalname)
            .name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 60) || 'image';
        const extension = path_1.default.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${safeBaseName}${extension}`);
    },
});
exports.imageUpload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: exports.maxImageUploadSize,
    },
    fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return cb(new AppError_1.AppError('Only image files are allowed.', 400));
        }
        cb(null, true);
    },
});

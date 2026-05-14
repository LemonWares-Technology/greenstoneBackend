"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupUploadedFiles = exports.parseOptionalBoolean = exports.parseOptionalNumber = exports.parseStringArray = exports.getFieldFiles = exports.fileToUrl = void 0;
const fs_1 = __importDefault(require("fs"));
const fileToUrl = (file) => (file ? `/upload/${file.filename}` : undefined);
exports.fileToUrl = fileToUrl;
const getFieldFiles = (files, field) => {
    if (!files)
        return [];
    if (Array.isArray(files))
        return files.filter((file) => file.fieldname === field);
    return files[field] ?? [];
};
exports.getFieldFiles = getFieldFiles;
const parseStringArray = (value) => {
    if (!value)
        return [];
    if (Array.isArray(value))
        return value.flatMap(exports.parseStringArray);
    if (typeof value !== 'string')
        return [];
    const trimmed = value.trim();
    if (!trimmed)
        return [];
    if (trimmed.startsWith('[')) {
        try {
            const parsed = JSON.parse(trimmed);
            return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === 'string') : [];
        }
        catch {
            return [];
        }
    }
    return trimmed.includes(',')
        ? trimmed.split(',').map((entry) => entry.trim()).filter(Boolean)
        : [trimmed];
};
exports.parseStringArray = parseStringArray;
const parseOptionalNumber = (value) => {
    if (value === undefined || value === null || value === '')
        return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
};
exports.parseOptionalNumber = parseOptionalNumber;
const parseOptionalBoolean = (value) => {
    if (typeof value === 'boolean')
        return value;
    if (typeof value !== 'string')
        return false;
    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
};
exports.parseOptionalBoolean = parseOptionalBoolean;
const cleanupUploadedFiles = (files) => {
    for (const file of files) {
        fs_1.default.unlink(file.path, () => undefined);
    }
};
exports.cleanupUploadedFiles = cleanupUploadedFiles;

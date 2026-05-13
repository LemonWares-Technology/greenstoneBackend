"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const config_1 = require("./config");
const app = (0, express_1.default)();
// ====================== MIDDLEWARE ======================
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
if (config_1.config.nodeEnv === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Debug middleware (remove after testing)
app.use((req, res, next) => {
    if (config_1.config.nodeEnv !== 'production') {
        console.log(`[Request] ${req.method} ${req.path} | Origin: ${req.headers.origin}`);
    }
    next();
});
// ====================== ROUTES ======================
app.use('/api', routes_1.default);
app.use('/', routes_1.default); // Helps if cPanel mounts app at /api and strips prefix
// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Not Found' });
});
// Global Error Handler
app.use(errorHandler_1.errorHandler);
exports.default = app;

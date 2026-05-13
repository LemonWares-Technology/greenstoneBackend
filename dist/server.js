"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const seed_1 = require("./seed");
const start = async () => {
    await (0, seed_1.seedDatabase)();
    app_1.default.listen(config_1.config.port, () => {
        console.log(`Server is running on port ${config_1.config.port}`);
    });
};
// Always start — Passenger requires this file, so require.main === module is false
// but Passenger still expects the server to bind
start().catch((err) => {
    console.error(err);
    process.exit(1);
});
exports.default = app_1.default;
module.exports = app_1.default;

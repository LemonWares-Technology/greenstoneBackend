"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const seed_1 = require("./seed");
const start = async () => {
    // Seed the database from .env credentials and demo data
    await (0, seed_1.seedDatabase)();
    app_1.default.listen(config_1.config.port, () => {
        console.log(`Server is running on port ${config_1.config.port}`);
    });
};
start();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_2 = require("@clerk/express");
require("source-map-support/register");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const follow_routes_1 = __importDefault(require("./routes/follow.routes"));
const availability_routes_1 = __importDefault(require("./routes/availability.routes"));
const service_routes_1 = __importDefault(require("./routes/service.routes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)({
    origin: ["tus rutas https"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // por si usas cookies 
}));
app.use(express_1.default.json());
app.use((0, express_2.clerkMiddleware)());
app.use("/", express_1.default.static('dist', { redirect: false }));
/*
Rutas
*/
app.use('/hackaton/users', user_routes_1.default);
app.use('/hackaton/follow', follow_routes_1.default);
app.use('/hackaton/availability', availability_routes_1.default);
app.use('/hackaton/services', service_routes_1.default);
app.get(/(.*)/, (req, res, next) => {
    return res.sendFile(path_1.default.resolve("dist/index.html"));
});
app.get('/', (_req, res) => {
    res.send('API en marcha ✅');
});
exports.default = app;
//# sourceMappingURL=app.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
// import dotenv from 'dotenv';
const connexion_1 = require("./connexion");
// dotenv.config();
// Puerto
const PORT = process.env.PORT || 5005;
// Conexión a MongoDB
(0, connexion_1.conexion)()
    .then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`🟢 Servidor escuchando en el puerto ${PORT}`);
    });
})
    .catch(err => {
    console.error('🔴 Conexión fallida');
});
//# sourceMappingURL=server.js.map
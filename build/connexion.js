"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conexion = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('debug', true);
const conexion = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mongodb', {
        // Estos dos parámetros ya no son necesarios en Mongoose 7+ porque vienen activados por defecto.
        // useNewUrlParser: true,
        // useUnifiedTopology: true
        });
        console.log('🟢 Conectado a la db');
    }
    catch (error) {
        console.error('🔴 Error al conectar a la base de datos:', error);
        throw new Error('No se ha podido conectar a la base de datos');
    }
});
exports.conexion = conexion;
//# sourceMappingURL=connexion.js.map
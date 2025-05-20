"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeeklyAvailability = exports.setWeeklyAvailability = void 0;
const availabilityRule_schema_1 = __importDefault(require("../models/availabilityRule.schema"));
const setWeeklyAvailability = (req, res) => {
    const { clerkId, rules } = req.body;
    if (!clerkId || !Array.isArray(rules)) {
        res.status(400).json({ message: "Entrada inválida" });
        return;
    }
    const rulesToInsert = rules.map(rule => ({
        dayOfWeek: rule.dayOfWeek,
        startTime: rule.startTime,
        endTime: rule.endTime,
        autoBreakMinutes: rule.autoBreakMinutes || 0,
        professional: clerkId
    }));
    availabilityRule_schema_1.default.deleteMany({ professional: clerkId })
        .then(() => availabilityRule_schema_1.default.insertMany(rulesToInsert))
        .then(inserted => {
        res.status(201).json({ message: "Disponibilidad actualizada", rules: inserted });
        return;
    })
        .catch(err => res.status(500).json({ message: "Error guardando disponibilidad", detail: err }));
};
exports.setWeeklyAvailability = setWeeklyAvailability;
const getWeeklyAvailability = (req, res) => {
    const idProfesional = req.params.id;
    if (!idProfesional) {
        res.status(400).json({ error: "Falta el ID del profesional" });
        return;
    }
    availabilityRule_schema_1.default.find({ professional: idProfesional })
        .then(rules => res.status(200).json(rules))
        .catch(err => res.status(500).json({ error: "Error obteniendo disponibilidad", detail: err }));
};
exports.getWeeklyAvailability = getWeeklyAvailability;
//# sourceMappingURL=availabilityRule.controller.js.map
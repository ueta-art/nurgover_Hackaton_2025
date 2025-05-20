"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailabilityExceptions = exports.setAvailabilityExceptions = void 0;
const availabilityException_schema_1 = __importDefault(require("../models/availabilityException.schema"));
const normalizeDate = (d) => {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};
const setAvailabilityExceptions = (req, res) => {
    const { clerkId, exceptions } = req.body;
    if (!clerkId || !Array.isArray(exceptions)) {
        res.status(400).json({ error: "Entrada inválida" });
        return;
    }
    availabilityException_schema_1.default.deleteMany({ professional: clerkId })
        .then(() => {
        const cleaned = exceptions.map((ex) => ({
            professional: clerkId,
            date: normalizeDate(new Date(ex.date)),
            isFullDay: ex.isFullDay,
            reason: ex.reason || '',
            startTime: ex.isFullDay ? undefined : ex.startTime,
            endTime: ex.isFullDay ? undefined : ex.endTime
        }));
        return availabilityException_schema_1.default.insertMany(cleaned);
    })
        .then(inserted => {
        res.status(201).json({
            message: 'Excepciones actualizadas correctamente',
            inserted
        });
        return;
    })
        .catch(err => {
        res.status(500).json({
            message: 'Error guardando excepciones',
            detail: err
        });
    });
};
exports.setAvailabilityExceptions = setAvailabilityExceptions;
const getAvailabilityExceptions = (req, res) => {
    const professionalId = req.params.id;
    if (!professionalId) {
        res.status(400).json({ error: 'ID de profesional requerido' });
        return;
    }
    availabilityException_schema_1.default.find({ professional: professionalId })
        .sort({ date: 1 }) // orden cronológico opcional
        .then((exceptions) => {
        res.status(200).json(exceptions);
    })
        .catch((err) => {
        res.status(500).json({
            message: 'Error obteniendo excepciones',
            detail: err
        });
    });
};
exports.getAvailabilityExceptions = getAvailabilityExceptions;
//# sourceMappingURL=availabilityException.controller.js.map
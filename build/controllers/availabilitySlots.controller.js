"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailabilitySlots = void 0;
const availabilityRule_schema_1 = __importDefault(require("../models/availabilityRule.schema"));
const availabilityException_schema_1 = __importDefault(require("../models/availabilityException.schema"));
const booking_schema_1 = __importDefault(require("../models/booking.schema"));
const service_schema_1 = __importDefault(require("../models/service.schema"));
const date_fns_1 = require("date-fns");
const getAvailabilitySlots = (req, res) => {
    const { professionalId } = req.params;
    const { start, end, serviceId } = req.query;
    if (!start || !end || !serviceId) {
        res.status(400).json({ error: "Faltan parámetros requeridos" });
        return;
    }
    service_schema_1.default.findById(serviceId)
        .then(service => {
        if (!service) {
            res.status(404).json({ error: "Servicio no encontrado" });
            return Promise.reject("stop");
        }
        const duration = service.durationMinutes;
        const maxClients = service.maxClientsPerSlot || 1;
        return Promise.all([
            availabilityRule_schema_1.default.find({ professional: professionalId }),
            availabilityException_schema_1.default.find({ professional: professionalId }),
            booking_schema_1.default.find({
                professional: professionalId,
                date: { $gte: start, $lte: end }
            }),
            Promise.resolve(duration),
            Promise.resolve(maxClients)
        ]);
    })
        .then(([rules, exceptions, bookings, duration, maxClients]) => {
        const slots = [];
        const startDate = new Date(start);
        const endDate = new Date(end);
        for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
            const dayOfWeek = day.getDay(); // 0=Dom, 1=Lun, etc.
            const dateStr = (0, date_fns_1.format)(day, "yyyy-MM-dd");
            const rulesForDay = rules.filter(r => r.dayOfWeek === dayOfWeek);
            const exceptionsForDay = exceptions.filter(e => (0, date_fns_1.format)(new Date(e.date), "yyyy-MM-dd") === dateStr);
            if (exceptionsForDay.some(e => e.isFullDay))
                continue;
            for (const rule of rulesForDay) {
                const blockStart = (0, date_fns_1.parse)(`${dateStr} ${rule.startTime}`, "yyyy-MM-dd HH:mm", new Date());
                const blockLimit = (0, date_fns_1.parse)(`${dateStr} ${rule.endTime}`, "yyyy-MM-dd HH:mm", new Date());
                let slotStart = new Date(blockStart);
                while ((0, date_fns_1.isBefore)((0, date_fns_1.addMinutes)(slotStart, duration), blockLimit) || +(0, date_fns_1.addMinutes)(slotStart, duration) === +blockLimit) {
                    const slotEnd = (0, date_fns_1.addMinutes)(slotStart, duration);
                    const isException = exceptionsForDay.some(e => {
                        if (!e.startTime || !e.endTime)
                            return false;
                        const exStart = (0, date_fns_1.parse)(`${dateStr} ${e.startTime}`, "yyyy-MM-dd HH:mm", new Date());
                        const exEnd = (0, date_fns_1.parse)(`${dateStr} ${e.endTime}`, "yyyy-MM-dd HH:mm", new Date());
                        return ((slotStart >= exStart && slotStart < exEnd) ||
                            (slotEnd > exStart && slotEnd <= exEnd));
                    });
                    if (!isException) {
                        const startTimeStr = (0, date_fns_1.format)(slotStart, "HH:mm");
                        const clientCount = bookings.filter(b => (0, date_fns_1.format)(b.date, "yyyy-MM-dd") === dateStr &&
                            b.startTime === startTimeStr &&
                            b.service.toString() === serviceId).length;
                        if (clientCount < maxClients) {
                            slots.push({
                                date: dateStr,
                                startTime: (0, date_fns_1.format)(slotStart, "HH:mm"),
                                endTime: (0, date_fns_1.format)(slotEnd, "HH:mm"),
                                start: slotStart.toISOString(),
                                end: slotEnd.toISOString(),
                                clientCount
                            });
                        }
                    }
                    slotStart = (0, date_fns_1.addMinutes)(slotStart, duration);
                }
            }
        }
        res.status(200).json(slots);
    })
        .catch(err => {
        if (err !== "stop") {
            console.error("Error al generar slots:", err);
            res.status(500).json({ error: "Error interno del servidor", detail: err });
        }
    });
};
exports.getAvailabilitySlots = getAvailabilitySlots;
//# sourceMappingURL=availabilitySlots.controller.js.map
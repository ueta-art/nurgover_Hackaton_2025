"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const availabilityRuleSchema = new mongoose_1.Schema({
    professional: {
        type: String,
        ref: 'User',
        required: true
    },
    dayOfWeek: {
        type: Number,
        min: 0,
        max: 6,
        required: true
    }, // 0 = domingo, 6 = sábado
    startTime: {
        type: String,
        required: true
    }, // Formato "HH:mm"
    endTime: {
        type: String,
        required: true
    },
    autoBreakMinutes: {
        type: Number,
        default: 0
    } // Descanso automático después de las reservas
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('AvailabilityRule', availabilityRuleSchema);
//# sourceMappingURL=availabilityRule.schema.js.map
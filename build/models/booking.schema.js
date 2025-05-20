"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    client: {
        type: String,
        ref: 'User',
        required: true
    },
    professional: {
        type: String,
        ref: 'User',
        required: true
    },
    service: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pendiente', 'confirmada', 'cancelada'],
        default: 'pendiente'
    },
    modificationRequested: {
        type: Boolean,
        default: false
    },
    modificationRequestedBy: {
        type: String,
        ref: 'User'
    },
    modificationDetails: {
        type: String
    },
    modificationConfirmedByClient: {
        type: Boolean,
        default: false
    },
    durationFeedback: {
        type: String,
        enum: ['shorter', 'expected', 'longer'],
        default: 'expected'
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Booking', bookingSchema);
//# sourceMappingURL=booking.schema.js.map
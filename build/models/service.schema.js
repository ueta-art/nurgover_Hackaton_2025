"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const serviceSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    billingType: {
        type: String,
        enum: ['hourly', 'daily', 'monthly'],
        default: 'hourly'
    },
    durationMinutes: {
        type: Number,
        required: true
    },
    price: {
        type: Number
    },
    professional: {
        type: String,
        ref: 'User',
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    tags: [{
            type: String
        }],
    images: [{
            type: String
        }],
    maxClientsPerSlot: {
        type: Number,
        required: false
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Service', serviceSchema);
//# sourceMappingURL=service.schema.js.map
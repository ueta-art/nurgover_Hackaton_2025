"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['cliente', 'professional', 'admin'],
        default: 'cliente'
    },
    name: {
        type: String,
        default: ''
    },
    surname: {
        type: String,
        default: ''
    },
    nick: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: 'en'
    },
    bio: {
        type: String,
        required: false
    },
    // Extras para profesionales:
    availabilityRules: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'AvailabilityRule'
        }],
    googleCalendarId: {
        type: String
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=user.schema.js.map
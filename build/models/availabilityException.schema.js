"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const availabilityExceptionSchema = new mongoose_1.Schema({
    professional: {
        type: String,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    isFullDay: {
        type: Boolean
    },
    startTime: {
        type: String,
        required: function () {
            return this.isFullDay === false;
        }
    },
    endTime: {
        type: String,
        required: function () {
            return this.isFullDay === false;
        }
    },
    reason: {
        type: String
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('AvailabilityException', availabilityExceptionSchema);
//# sourceMappingURL=availabilityException.schema.js.map
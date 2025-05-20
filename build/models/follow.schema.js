"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const followSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    followed: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
followSchema.index({ user: 1, followed: 1 }, { unique: true }); //Esta línea crea un índice compuesto en MongoDB para garantizar que un mismo usuario no pueda seguir al mismo profesional más de una vez.
exports.default = (0, mongoose_1.model)('Follow', followSchema);
//# sourceMappingURL=follow.schema.js.map
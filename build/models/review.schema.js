"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/*
Cuando un nuevo review se crea:
Se guarda en Review.
Se recalcula el promedio de todas las reseñas del servicio.
Se actualiza el campo rating en Service.
*/
const reviewSchema = new mongoose_1.Schema({
    service: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Review", reviewSchema);
//# sourceMappingURL=review.schema.js.map
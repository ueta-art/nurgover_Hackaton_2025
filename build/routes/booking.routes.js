"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("../controllers/booking.controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Crear una nueva reserva (cliente)
router.post("/", auth_1.auth, booking_controller_1.createBooking);
// Ver mis reservas (cliente)
router.get("/mine", auth_1.auth, booking_controller_1.getMyBookings);
// Ver reservas recibidas (profesional)
router.get("/professional", auth_1.auth, booking_controller_1.getBookingsForProfessional);
// Cancelar una reserva (cliente, 24h antes)
router.patch("/:id/cancel", auth_1.auth, booking_controller_1.cancelBooking);
// Confirmar una reserva (profesional)
router.patch("/:id/confirm", auth_1.auth, booking_controller_1.confirmBooking);
// Solicitar una modificación (cliente o profesional)
router.patch("/:id/request-modification", auth_1.auth, booking_controller_1.requestModification);
// Confirmar la modificación (la parte receptora)
router.patch("/:id/confirm-modification", auth_1.auth, booking_controller_1.confirmModification);
// Rechazar la modificación (la parte receptora)
router.patch("/:id/cancel-modification", auth_1.auth, booking_controller_1.cancelModification);
// Indicar duración del servicio (profesional)
router.patch("/:id/duration-feedback", auth_1.auth, booking_controller_1.setDurationFeedback);
// Puntuar el servicio (cliente)
router.post("/:id/rating", auth_1.auth, booking_controller_1.addRatingFeedback);
exports.default = router;
//# sourceMappingURL=booking.routes.js.map
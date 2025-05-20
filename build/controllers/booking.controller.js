"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRatingFeedback = exports.setDurationFeedback = exports.cancelModification = exports.confirmModification = exports.requestModification = exports.confirmBooking = exports.cancelBooking = exports.getBookingsForProfessional = exports.getMyBookings = exports.createBooking = void 0;
const booking_schema_1 = __importDefault(require("../models/booking.schema"));
const service_schema_1 = __importDefault(require("../models/service.schema"));
const user_schema_1 = __importDefault(require("../models/user.schema"));
const review_schema_1 = __importDefault(require("../models/review.schema"));
const moment_1 = __importDefault(require("moment"));
const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};
const createBooking = (req, res) => {
    const { client, professional, service, date, startTime, endTime } = req.body;
    if (!client || !professional || !service || !date || !startTime || !endTime) {
        res.status(400).json({ message: 'Faltan campos obligatorios' });
        return;
    }
    service_schema_1.default.findById(service)
        .then((serviceDoc) => {
        if (!serviceDoc) {
            res.status(404).json({ message: 'Servicio no encontrado' });
            return;
        }
        const billingType = serviceDoc.billingType;
        const bookingDate = (0, moment_1.default)(date);
        booking_schema_1.default.find({
            professional,
            date: bookingDate.toDate(),
        })
            .then((existingBookings) => {
            const conflict = existingBookings.some((b) => {
                if (billingType === 'hourly') {
                    const newStart = timeToMinutes(startTime);
                    const newEnd = timeToMinutes(endTime);
                    const bStart = timeToMinutes(b.startTime);
                    const bEnd = timeToMinutes(b.endTime);
                    return newStart < bEnd && newEnd > bStart;
                }
                else if (billingType === 'daily') {
                    return (0, moment_1.default)(b.date).isSame(bookingDate, 'day');
                }
                else if (billingType === 'monthly') {
                    return (0, moment_1.default)(b.date).isSame(bookingDate, 'month');
                }
                return false;
            });
            if (conflict) {
                res.status(409).json({ message: 'El horario ya está ocupado' });
                return;
            }
            const newBooking = new booking_schema_1.default({
                client,
                professional,
                service,
                date: bookingDate.toDate(),
                startTime,
                endTime,
                status: 'pendiente',
            });
            newBooking.save()
                .then((saved) => {
                res.status(201).json(saved);
            })
                .catch((err) => {
                res.status(500).json({ message: 'Error guardando la reserva', error: err });
            });
        })
            .catch((err) => {
            res.status(500).json({ message: 'Error consultando reservas', error: err });
        });
    })
        .catch((err) => {
        res.status(500).json({ message: 'Error buscando servicio', error: err });
    });
};
exports.createBooking = createBooking;
const getMyBookings = (req, res) => {
    var _a;
    const clientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!clientId) {
        res.status(401).json({ error: "No autenticado" });
        return;
    }
    booking_schema_1.default.find({ client: clientId })
        .sort({ date: -1 })
        .populate("professional", "name surname nick")
        .populate("service", "name durationMinutes price")
        .then(bookings => res.status(200).json(bookings))
        .catch(err => res.status(500).json({ error: "Error al obtener reservas", detail: err }));
};
exports.getMyBookings = getMyBookings;
const getBookingsForProfessional = (req, res) => {
    var _a;
    const professionalId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!professionalId) {
        res.status(401).json({ error: "No autenticado" });
        return;
    }
    user_schema_1.default.findById(professionalId)
        .then(user => {
        if (!user || user.role !== "professional") {
            res.status(403).json({ error: "Solo profesionales pueden acceder a su agenda" });
            return;
        }
        booking_schema_1.default.find({ professional: professionalId })
            .sort({ date: -1 })
            .populate("client", "name surname nick")
            .populate("service", "name durationMinutes price")
            .then(bookings => res.status(200).json(bookings))
            .catch(err => res.status(500).json({ error: "Error al obtener reservas", detail: err }));
    })
        .catch(err => res.status(500).json({ error: "Error verificando rol", detail: err }));
};
exports.getBookingsForProfessional = getBookingsForProfessional;
const cancelBooking = (req, res) => {
    var _a;
    const clientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id } = req.params;
    if (!clientId) {
        res.status(401).json({ error: "No autenticado" });
        return;
    }
    booking_schema_1.default.findById(id)
        .then(booking => {
        if (!booking) {
            res.status(404).json({ error: "Reserva no encontrada" });
            return;
        }
        if (booking.client.toString() !== clientId) {
            res.status(403).json({ error: "No tienes permiso para cancelar esta reserva" });
            return;
        }
        const bookingDateTimeUTC = new Date(`${booking.date.toISOString().split("T")[0]}T${booking.startTime}:00Z`);
        const nowUTC = new Date();
        const diffMs = bookingDateTimeUTC.getTime() - nowUTC.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        if (diffHours < 24) {
            res.status(400).json({ error: "La reserva solo puede cancelarse con al menos 24 horas de antelación" });
            return;
        }
        booking.status = "cancelada";
        booking.save()
            .then(updated => res.status(200).json(updated))
            .catch(err => res.status(500).json({ error: "Error al cancelar la reserva", detail: err }));
    })
        .catch(err => res.status(500).json({ error: "Error al buscar reserva", detail: err }));
};
exports.cancelBooking = cancelBooking;
const confirmBooking = (req, res) => {
    var _a;
    const professionalId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id } = req.params;
    if (!professionalId) {
        res.status(401).json({ error: "No autenticado" });
        return;
    }
    booking_schema_1.default.findById(id)
        .then(booking => {
        if (!booking) {
            res.status(404).json({ error: "Reserva no encontrada" });
            return;
        }
        if (booking.professional.toString() !== professionalId) {
            res.status(403).json({ error: "No tienes permiso para confirmar esta reserva" });
            return;
        }
        if (booking.status !== "pendiente") {
            res.status(400).json({ error: "Solo se pueden confirmar reservas pendientes" });
            return;
        }
        booking.status = "confirmada";
        booking.save()
            .then(updated => res.status(200).json(updated))
            .catch(err => res.status(500).json({ error: "Error al confirmar reserva", detail: err }));
    })
        .catch(err => res.status(500).json({ error: "Error al buscar reserva", detail: err }));
};
exports.confirmBooking = confirmBooking;
const requestModification = (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id } = req.params;
    const { date, startTime, endTime, modificationDetails } = req.body;
    if (!userId || !date || !startTime || !endTime || !modificationDetails) {
        res.status(400).json({ error: "Faltan datos obligatorios" });
        return;
    }
    booking_schema_1.default.findById(id)
        .then(booking => {
        if (!booking) {
            res.status(404).json({ error: "Reserva no encontrada" });
            return;
        }
        const isOwner = booking.client.toString() === userId || booking.professional.toString() === userId;
        if (!isOwner) {
            res.status(403).json({ error: "No tienes permiso para modificar esta reserva" });
            return;
        }
        service_schema_1.default.findById(booking.service)
            .then(service => {
            if (!service || !service.active) {
                res.status(400).json({ error: "El servicio ya no está activo" });
                return;
            }
            booking_schema_1.default.find({
                _id: { $ne: id },
                professional: booking.professional,
                date,
                $or: [
                    { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
                ]
            })
                .then(conflicts => {
                if (conflicts.length > 0) {
                    res.status(409).json({ error: "El horario propuesto ya está ocupado" });
                    return;
                }
                booking.date = date;
                booking.startTime = startTime;
                booking.endTime = endTime;
                booking.modificationDetails = modificationDetails;
                booking.modificationRequested = true;
                booking.modificationConfirmedByClient = false;
                booking.modificationRequestedBy = userId;
                booking.save()
                    .then(updated => res.status(200).json(updated))
                    .catch(err => res.status(500).json({ error: "Error al guardar modificación", detail: err }));
            })
                .catch(err => res.status(500).json({ error: "Error comprobando conflictos", detail: err }));
        })
            .catch(err => res.status(500).json({ error: "Error verificando servicio", detail: err }));
    })
        .catch(err => res.status(500).json({ error: "Error buscando reserva", detail: err }));
};
exports.requestModification = requestModification;
const confirmModification = (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id } = req.params;
    if (!userId) {
        res.status(401).json({ error: "No autenticado" });
        return;
    }
    booking_schema_1.default.findById(id)
        .then(booking => {
        if (!booking) {
            res.status(404).json({ error: "Reserva no encontrada" });
            return;
        }
        if (!booking.modificationRequested) {
            res.status(400).json({ error: "No hay una modificación pendiente" });
            return;
        }
        if (booking.modificationRequestedBy === userId) {
            res.status(403).json({ error: "No puedes confirmar tu propia modificación" });
            return;
        }
        booking.modificationConfirmedByClient = true;
        booking.modificationRequested = false;
        booking.save()
            .then(updated => res.status(200).json(updated))
            .catch(err => res.status(500).json({ error: "Error al guardar confirmación", detail: err }));
    })
        .catch(err => res.status(500).json({ error: "Error al buscar reserva", detail: err }));
};
exports.confirmModification = confirmModification;
const cancelModification = (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id } = req.params;
    if (!userId) {
        res.status(401).json({ error: "No autenticado" });
        return;
    }
    booking_schema_1.default.findById(id)
        .then(booking => {
        if (!booking) {
            res.status(404).json({ error: "Reserva no encontrada" });
            return;
        }
        if (!booking.modificationRequested) {
            res.status(400).json({ error: "No hay modificación pendiente para cancelar" });
            return;
        }
        if (booking.modificationRequestedBy === userId) {
            res.status(403).json({ error: "No puedes cancelar tu propia propuesta de modificación" });
            return;
        }
        booking.modificationConfirmedByClient = false;
        booking.modificationRequested = false;
        booking.save()
            .then(updated => res.status(200).json(updated))
            .catch(err => res.status(500).json({ error: "Error al guardar cancelación", detail: err }));
    })
        .catch(err => res.status(500).json({ error: "Error al buscar reserva", detail: err }));
};
exports.cancelModification = cancelModification;
const setDurationFeedback = (req, res) => {
    var _a;
    const professionalId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id } = req.params;
    const { durationFeedback } = req.body;
    if (!professionalId || !["shorter", "expected", "longer"].includes(durationFeedback)) {
        res.status(400).json({ error: "Entrada no válida" });
        return;
    }
    booking_schema_1.default.findById(id)
        .then(booking => {
        if (!booking) {
            res.status(404).json({ error: "Reserva no encontrada" });
            return;
        }
        if (booking.professional.toString() !== professionalId) {
            res.status(403).json({ error: "No tienes permiso para modificar esta reserva" });
            return;
        }
        booking.durationFeedback = durationFeedback;
        booking.save()
            .then(updated => res.status(200).json(updated))
            .catch(err => res.status(500).json({ error: "Error al guardar duración", detail: err }));
    })
        .catch(err => res.status(500).json({ error: "Error al buscar reserva", detail: err }));
};
exports.setDurationFeedback = setDurationFeedback;
const addRatingFeedback = (req, res) => {
    var _a;
    const clientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id } = req.params;
    const { rating, comment } = req.body;
    if (!clientId || typeof rating !== "number" || rating < 1 || rating > 5) {
        res.status(400).json({ error: "Puntuación inválida" });
        return;
    }
    booking_schema_1.default.findById(id)
        .then(booking => {
        if (!booking) {
            res.status(404).json({ error: "Reserva no encontrada" });
            return;
        }
        if (booking.client.toString() !== clientId) {
            res.status(403).json({ error: "No tienes permiso para puntuar esta reserva" });
            return;
        }
        // Crear reseña
        review_schema_1.default.create({
            service: booking.service,
            user: clientId,
            rating,
            comment
        })
            .then(() => {
            // Recalcular promedio
            review_schema_1.default.aggregate([
                { $match: { service: booking.service } },
                {
                    $group: {
                        _id: "$service",
                        avgRating: { $avg: "$rating" }
                    }
                }
            ])
                .then(result => {
                var _a;
                const newAvg = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.avgRating) || 0;
                service_schema_1.default.findByIdAndUpdate(booking.service, { rating: newAvg }, { new: true })
                    .then(() => res.status(200).json({ message: "Valoración registrada correctamente", rating: newAvg }))
                    .catch(err => res.status(500).json({ error: "Error al actualizar promedio", detail: err }));
            })
                .catch(err => res.status(500).json({ error: "Error al calcular promedio", detail: err }));
        })
            .catch(err => res.status(500).json({ error: "Error al crear reseña", detail: err }));
    })
        .catch(err => res.status(500).json({ error: "Error al buscar reserva", detail: err }));
};
exports.addRatingFeedback = addRatingFeedback;
//# sourceMappingURL=booking.controller.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceById = exports.getServicesByProfessional = exports.getMyServices = exports.deleteService = exports.stopService = exports.updateService = exports.createService = exports.getActiveServices = void 0;
const service_schema_1 = __importDefault(require("../models/service.schema"));
const booking_schema_1 = __importDefault(require("../models/booking.schema")); // suponiendo que el modelo de reservas se llama así
const user_schema_1 = __importDefault(require("../models/user.schema"));
const getActiveServices = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    service_schema_1.default.find({ active: true, deleted: false });
    service_schema_1.default.find({ active: true, deleted: false })
        .then((services) => {
        const clerkIds = services.map((s) => s.professional);
        return user_schema_1.default.find({ clerkId: { $in: clerkIds } })
            .then((users) => {
            const userMap = {};
            users.forEach((user) => {
                userMap[user.clerkId] = user;
            });
            const populated = services.map((service) => {
                return Object.assign(Object.assign({}, service.toObject()), { professional: userMap[service.professional] || service.professional });
            });
            res.status(200).json(populated);
            return;
        });
    })
        .catch((error) => {
        res.status(500).json({
            error: "Error al obtener servicios activos",
            detail: error,
        });
    });
});
exports.getActiveServices = getActiveServices;
const createService = (req, res) => {
    const { clerkId, name, description, billingType, durationMinutes, price, tags, images, rating, maxClientsPerSlot } = req.body;
    user_schema_1.default.findOne({ clerkId: clerkId })
        .then(user => {
        if (!user) {
            res.status(403).json({ error: "Usuario no encontrado" });
            return;
        }
        if (!user || user.role !== "professional") {
            res.status(403).json({ error: "Solo profesionales pueden crear servicios" });
            return;
        }
        service_schema_1.default.create({
            name,
            description,
            billingType,
            durationMinutes,
            price,
            active: true,
            tags,
            images,
            professional: clerkId,
            rating,
            maxClientsPerSlot
        })
            .then(service => res.status(201).json(service))
            .catch(err => res.status(500).json({ error: "Error al crear servicio", detail: err }));
    })
        .catch(err => res.status(500).json({ error: "Error verificando rol", detail: err }));
};
exports.createService = createService;
const updateService = (req, res) => {
    var _a;
    const professionalId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id } = req.params;
    service_schema_1.default.findById(id)
        .then(service => {
        if (!service) {
            res.status(404).json({ error: "Servicio no encontrado" });
            return;
        }
        if (service.professional.toString() !== professionalId) {
            res.status(403).json({ error: "No tienes permiso para editar este servicio" });
            return;
        }
        const allowedFields = ["name", "description", "billingType", "durationMinutes", "price", "tags", "images"]; //para active tengo otro controller específico
        const updateFields = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        });
        service_schema_1.default.findByIdAndUpdate(id, updateFields, { new: true })
            .then(updated => res.status(200).json(updated))
            .catch(err => res.status(500).json({ error: "Error actualizando servicio", detail: err }));
    })
        .catch(err => res.status(500).json({ error: "Error accediendo al servicio", detail: err }));
};
exports.updateService = updateService;
const stopService = (req, res) => {
    var _a;
    const professionalId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id } = req.params;
    service_schema_1.default.findById(id)
        .then(service => {
        if (!service) {
            res.status(404).json({ error: "Servicio no encontrado" });
            return;
        }
        if (service.professional.toString() !== professionalId) {
            res.status(403).json({ error: "No tienes permiso para detener este servicio" });
            return;
        }
        service_schema_1.default.findByIdAndUpdate(id, { active: false }, { new: true })
            .then(updated => res.status(200).json({ message: "Servicio detenido", service: updated }))
            .catch(err => res.status(500).json({ error: "Error al detener el servicio", detail: err }));
    })
        .catch(err => res.status(500).json({ error: "Error al buscar servicio", detail: err }));
};
exports.stopService = stopService;
const deleteService = (req, res) => {
    var _a;
    const professionalId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id } = req.params;
    service_schema_1.default.findById(id)
        .then(service => {
        if (!service) {
            res.status(404).json({ error: "Servicio no encontrado" });
            return;
        }
        if (service.professional.toString() !== professionalId) {
            res.status(403).json({ error: "No tienes permiso para eliminar este servicio" });
            return;
        }
        booking_schema_1.default.findOne({ service: id })
            .then(existingBooking => {
            if (existingBooking) {
                res.status(400).json({ error: "No puedes eliminar este servicio porque tiene reservas" });
                return;
            }
            service_schema_1.default.findByIdAndDelete(id)
                .then(() => res.status(200).json({ message: "Servicio eliminado correctamente" }))
                .catch(err => res.status(500).json({ error: "Error al eliminar el servicio", detail: err }));
        })
            .catch(err => res.status(500).json({ error: "Error comprobando reservas", detail: err }));
    })
        .catch(err => res.status(500).json({ error: "Error accediendo al servicio", detail: err }));
};
exports.deleteService = deleteService;
// PRIVATE: Ver mis servicios
const getMyServices = (req, res) => {
    const professionalId = req.params.id;
    service_schema_1.default.find({ professional: professionalId })
        .then(services => {
        res.status(200).json(services);
        return;
    })
        .catch(err => res.status(500).json({ error: "Error obteniendo tus servicios", detail: err }));
};
exports.getMyServices = getMyServices;
const getServicesByProfessional = (req, res) => {
    const { id } = req.params;
    service_schema_1.default.find({ professional: id, active: true })
        .then(services => {
        res.status(200).json(services);
        return;
    })
        .catch(err => res.status(500).json({ error: "Error obteniendo los servicios", detail: err }));
};
exports.getServicesByProfessional = getServicesByProfessional;
const getServiceById = (req, res) => {
    const { id } = req.params;
    service_schema_1.default.findById(id)
        .then((service) => __awaiter(void 0, void 0, void 0, function* () {
        if (!service) {
            res.status(404).json({ error: "Servicio no encontrado" });
            return;
        }
        try {
            const user = yield user_schema_1.default.findOne({ clerkId: service.professional });
            const populatedService = Object.assign(Object.assign({}, service.toObject()), { professional: user || service.professional });
            res.status(200).json(populatedService);
        }
        catch (userError) {
            res.status(500).json({
                error: "Error al obtener el profesional asociado",
                detail: userError,
            });
        }
    }))
        .catch((err) => {
        res.status(500).json({
            error: "Error accediendo al servicio",
            detail: err,
        });
    });
};
exports.getServiceById = getServiceById;
//# sourceMappingURL=service.controller.js.map
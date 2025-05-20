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
exports.countUsers = exports.deleteUser = exports.updateUser = exports.getProfile = exports.getProfessionals = exports.getUserByIdPublic = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const user_schema_1 = __importDefault(require("../models/user.schema"));
const follow_schema_1 = __importDefault(require("../models/follow.schema"));
const service_schema_1 = __importDefault(require("../models/service.schema"));
const availabilityRule_schema_1 = __importDefault(require("../models/availabilityRule.schema"));
const availabilityException_schema_1 = __importDefault(require("../models/availabilityException.schema"));
const booking_schema_1 = __importDefault(require("../models/booking.schema"));
const review_schema_1 = __importDefault(require("../models/review.schema"));
const express_1 = require("@clerk/express");
/// <reference types="../types" />
const createUser = (req, res) => {
    console.log('📦 req.body:', req.body);
    const { clerkId, role, name, surname, nick, email, language } = req.body; // json desde frotend
    // const { userId } = useAuth(req); // Authorization Bearer Token desde Clerk
    console.log('Creando usuario', req.body);
    user_schema_1.default.findOne({ clerkId })
        .then(existing => {
        if (existing) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        else {
            const newUser = new user_schema_1.default({
                clerkId,
                role,
                name,
                surname,
                nick,
                email,
                language
            });
            return newUser.save()
                .then(user => res.status(201).json(user));
        }
    })
        .catch(err => {
        res.status(500).json({ message: 'Error creando usuario', error: err });
    });
};
exports.createUser = createUser;
const getUsers = (_req, res) => {
    user_schema_1.default.find()
        .then(users => { return res.json(users); })
        .catch(err => {
        res.status(500).json({ message: 'Error obteniendo usuarios', error: err });
    });
};
exports.getUsers = getUsers;
/* ECONTRAR UN USUARIO */
const getUserById = (req, res) => {
    user_schema_1.default.findOne({ clerkId: req.params.id })
        .then((user) => {
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.json(user);
    })
        .catch((err) => {
        return res.status(500).json({ error: err });
    });
};
exports.getUserById = getUserById;
const getUserByIdPublic = (req, res) => {
    user_schema_1.default.findOne({ clerkId: req.params.id })
        .then((user) => {
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.json(user);
    })
        .catch((err) => {
        return res.status(500).json({ error: err });
    });
};
exports.getUserByIdPublic = getUserByIdPublic;
const getProfessionals = (_req, res) => {
    user_schema_1.default.find({ role: 'professional' })
        .then(professionals => res.json(professionals))
        .catch(err => {
        return res.status(500).json({ message: 'Error obteniendo profesionales', error: err });
    });
};
exports.getProfessionals = getProfessionals;
const getProfile = (req, res) => {
    var _a;
    const viewedUserId = req.params.id;
    const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!currentUserId) {
        res.status(401).json({ error: "No autenticado" });
        return;
    }
    user_schema_1.default.findById(viewedUserId)
        .select('-email -clerkId') // Ocultamos info privada
        .then((userProfile) => __awaiter(void 0, void 0, void 0, function* () {
        if (!userProfile || userProfile.role !== 'professional') {
            return res.status(404).json({ message: 'Este perfil no existe o no es público' });
        }
        // Info de seguimiento
        const leSigo = yield follow_schema_1.default.findOne({ user: currentUserId, followed: viewedUserId });
        return res.status(200).json({
            user: userProfile,
            leSigo: !!leSigo,
        });
    }))
        .catch(err => {
        res.status(500).json({ message: 'Error al obtener el perfil', error: err });
    });
};
exports.getProfile = getProfile;
const updateUser = (req, res) => {
    const { userId } = (0, express_1.getAuth)(req);
    const usuarioId = req.params.id;
    const allowedRoles = ["cliente", "professional"];
    const { name, surname, nick, language, role } = req.body;
    if (usuarioId !== userId) {
        res.status(403).json({ error: "No tienes permiso para editar este perfil" });
        return;
    }
    const updateData = {};
    if (name)
        updateData.name = name;
    if (surname)
        updateData.surname = surname;
    if (nick)
        updateData.nick = nick;
    if (language)
        updateData.language = language;
    if (role && allowedRoles.includes(role))
        updateData.role = role;
    user_schema_1.default.findOneAndUpdate({ clerkId: usuarioId }, updateData, { new: true })
        .then(updatedUser => {
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.status(200).json(updatedUser);
    })
        .catch(err => {
        res.status(500).json({ message: 'Error actualizando usuario', error: err });
    });
};
exports.updateUser = updateUser;
const deleteUser = (req, res) => {
    const usuarioId = req.params.id;
    user_schema_1.default.findOneAndDelete({ clerkId: usuarioId })
        .then(deletedUser => {
        if (!deletedUser) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        return service_schema_1.default.find({ professional: usuarioId })
            .then(servicios => {
            const serviciosIds = servicios.map(s => s._id);
            return service_schema_1.default.deleteMany({ professional: usuarioId })
                .then(() => {
                return availabilityRule_schema_1.default.deleteMany({ professional: usuarioId })
                    .then(() => {
                    return availabilityException_schema_1.default.deleteMany({ professional: usuarioId });
                });
            })
                .then(() => {
                return booking_schema_1.default.deleteMany({
                    $or: [
                        { client: usuarioId },
                        { professional: usuarioId },
                        { modificationRequestedBy: usuarioId }
                    ]
                });
            })
                .then(() => {
                return review_schema_1.default.deleteMany({
                    $or: [
                        { client: usuarioId },
                        { serviceId: { $in: serviciosIds } }
                    ]
                });
            })
                .then(() => {
                return follow_schema_1.default.deleteMany({
                    $or: [
                        { follower: usuarioId },
                        { following: usuarioId }
                    ]
                });
            })
                .then(() => {
                res.json({ message: 'Usuario y datos asociados eliminados correctamente' });
            });
        });
    })
        .catch(err => {
        console.error("Error en eliminación en cascada:", err);
        res.status(500).json({ message: 'Error eliminando usuario y sus datos asociados', error: err });
    });
};
exports.deleteUser = deleteUser;
const countUsers = (_req, res) => {
    user_schema_1.default.countDocuments()
        .then(total => res.json({ totalUsers: total }))
        .catch(err => {
        res.status(500).json({ message: 'Error contando usuarios', error: err });
    });
};
exports.countUsers = countUsers;
//# sourceMappingURL=user.controller.js.map
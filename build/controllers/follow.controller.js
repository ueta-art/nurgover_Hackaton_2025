"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowing = exports.unfollowProfessional = exports.followProfessional = void 0;
const user_schema_1 = __importDefault(require("../models/user.schema"));
const follow_schema_1 = __importDefault(require("../models/follow.schema"));
const followProfessional = (req, res) => {
    var _a;
    const { id: professionalId } = req.params;
    const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!currentUserId) {
        res.status(401).json({ error: "No autenticado" });
        return;
    }
    if (currentUserId === professionalId) {
        res.status(400).json({ error: "No puedes seguirte a ti misma" });
        return;
    }
    user_schema_1.default.findById(professionalId)
        .then(professional => {
        if (!professional || professional.role !== "professional") {
            res.status(404).json({ error: "Usuario no encontrado o no es profesional" });
            return;
        }
        follow_schema_1.default.findOne({ follower: currentUserId, following: professionalId })
            .then(existingFollow => {
            if (existingFollow) {
                res.status(409).json({ error: "Ya sigues a este profesional" });
                return;
            }
            follow_schema_1.default.create({ follower: currentUserId, following: professionalId })
                .then(newFollow => res.status(201).json(newFollow))
                .catch(err => res.status(500).json({ error: "Error al crear seguimiento", detail: err }));
        })
            .catch(err => res.status(500).json({ error: "Error al verificar seguimiento", detail: err }));
    })
        .catch(err => res.status(500).json({ error: "Error al buscar usuario", detail: err }));
};
exports.followProfessional = followProfessional;
const unfollowProfessional = (req, res) => {
    var _a;
    const { id: professionalId } = req.params;
    const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!currentUserId) {
        res.status(401).json({ error: "No autenticado" });
        return;
    }
    follow_schema_1.default.findOneAndDelete({ follower: currentUserId, following: professionalId })
        .then(deleted => {
        if (!deleted) {
            res.status(404).json({ error: "No estabas siguiendo a este profesional" });
            return;
        }
        res.status(200).json({ message: "Has dejado de seguir al profesional" });
    })
        .catch(err => res.status(500).json({ error: "Error al dejar de seguir", detail: err }));
};
exports.unfollowProfessional = unfollowProfessional;
const getFollowing = (req, res) => {
    var _a;
    const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!currentUserId) {
        res.status(401).json({ error: "No autenticado" });
        return;
    }
    follow_schema_1.default.find({ follower: currentUserId })
        .populate("following", "name surname nick role")
        .then(following => res.status(200).json(following))
        .catch(err => res.status(500).json({ error: "Error al obtener lista de seguidos", detail: err }));
};
exports.getFollowing = getFollowing;
//# sourceMappingURL=follow.controller.js.map
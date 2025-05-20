"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const follow_controller_1 = require("../controllers/follow.controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Seguir a un profesional
router.post("/:id", auth_1.auth, follow_controller_1.followProfessional);
// Dejar de seguir a un profesional
router.delete("/:id", auth_1.auth, follow_controller_1.unfollowProfessional);
// Obtener a quién estoy siguiendo
router.get("/", auth_1.auth, follow_controller_1.getFollowing);
exports.default = router;
//# sourceMappingURL=follow.routes.js.map
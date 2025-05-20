"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_controller_1 = require("../controllers/service.controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post("/", auth_1.auth, service_controller_1.createService);
router.put("/:id", auth_1.auth, service_controller_1.updateService);
router.patch("/:id/stop", auth_1.auth, service_controller_1.stopService);
router.delete("/:id", auth_1.auth, service_controller_1.deleteService);
router.get("/mine/:id", auth_1.auth, service_controller_1.getMyServices);
router.get("/activos", service_controller_1.getActiveServices);
router.get("/activos/:id", service_controller_1.getServicesByProfessional);
router.get("/:id", service_controller_1.getServiceById);
exports.default = router;
//# sourceMappingURL=service.routes.js.map
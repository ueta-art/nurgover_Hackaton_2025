"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const availabilityRule_controller_1 = require("../controllers/availabilityRule.controller");
const availabilityException_controller_1 = require("../controllers/availabilityException.controller");
const availabilitySlots_controller_1 = require("../controllers/availabilitySlots.controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post("/rules", auth_1.auth, availabilityRule_controller_1.setWeeklyAvailability);
router.get("/rules/:id", availabilityRule_controller_1.getWeeklyAvailability);
router.post("/exceptions", auth_1.auth, availabilityException_controller_1.setAvailabilityExceptions);
router.get("/exceptions/:id", auth_1.auth, availabilityException_controller_1.getAvailabilityExceptions);
router.get("/slots/:professionalId", availabilitySlots_controller_1.getAvailabilitySlots);
exports.default = router;
//# sourceMappingURL=availability.routes.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.post('/', auth_1.auth, user_controller_1.createUser);
router.get('/professionals', user_controller_1.getProfessionals);
router.get('/uno/:id', auth_1.auth, user_controller_1.getUserById);
router.get('/unop/:id', user_controller_1.getUserByIdPublic);
router.get('/:id', auth_1.auth, user_controller_1.getProfile);
router.put('/:id', auth_1.auth, user_controller_1.updateUser);
router.delete('/:id', auth_1.auth, user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map
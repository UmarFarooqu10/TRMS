import express from "express";
import { registerStudent, login } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { validate } from "../utils/validator.util.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/register", registerValidator, validate, registerStudent);
router.post("/login", authLimiter, loginValidator, validate, login);

export default router;

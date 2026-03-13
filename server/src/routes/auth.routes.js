import { Router } from "express";
import { register, verifyEmail, login } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/register", registerValidator, register);

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 * @body { email, password }
 */
authRouter.post("/login", loginValidator, login);

/**
 * @route GET /api/auth/verify-email
 * @desc Verify email
 * @access Public
 * @queryParam token
 */
authRouter.get("/verify-email", verifyEmail);

export default authRouter;
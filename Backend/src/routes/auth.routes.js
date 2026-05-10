import { Router } from "express";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { register, verifyEmail, login, getMe } from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import ROUTES from "../config/routes.config.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post(ROUTES.auth.register, registerValidator, register)

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 * @body { email, password }
 */
authRouter.post(ROUTES.auth.login, loginValidator, login)

/**
 * @route GET /api/auth/get-me
 * @desc Get current logged in user's details
 * @access Private
 */
authRouter.get(ROUTES.auth.getMe, authUser, getMe)

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 * @query { token }
 */
authRouter.get(ROUTES.auth.verifyEmail, verifyEmail)


export default authRouter;
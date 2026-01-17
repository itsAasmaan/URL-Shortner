import { Router } from "express";
import AuthenticationController from "../controllers/AuthenticationController.js";
import { authenticate } from "../middleware/authentication.js";
import { validateBody } from "../middleware/validateRequest.js";
import { registerUserSchema, loginUserSchema } from "../utils/validators.js";

const router = Router();

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
router.post("/register", validateBody(registerUserSchema), AuthenticationController.register);

/**
 * POST /api/v1/auth/login
 * Login user
 */
router.post("/login", validateBody(loginUserSchema), AuthenticationController.login);

/**
 * GET /api/v1/auth/me
 * Get current user (requires authentication)
 */
router.get("/me", authenticate, AuthenticationController.getCurrentUser);

/**
 * POST /api/v1/auth/logout
 * Logout user
 */
router.post("/logout", authenticate, AuthenticationController.logout);

export default router;

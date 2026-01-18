import { Router } from "express";
import URLController from "../controllers/URLController.js";
import { validateBody } from "../middleware/validateRequest.js";
import { createURLSchema } from "../utils/validators.js";
import { authenticate, optionalAuth } from "../middleware/authentication.js";

const router = Router();

/**
 * POST /api/v1/urls
 * Create a new shortened URL
 */
router.post("/", optionalAuth, validateBody(createURLSchema), URLController.createURL);

/**
 * GET /api/v1/urls/:shortCode
 * Get URL details
 */
router.get("/:shortCode", URLController.getURL);

/**
 * GET /api/v1/urls
 * Get user's URLs (requires authentication)
 */
router.get("/", authenticate, URLController.getUserURLs);

/**
 * PUT /api/v1/urls/:shortCode
 * Update URL (requires authentication)
 */
router.put("/:shortCode", authenticate, URLController.updateURL);

/**
 * DELETE /api/v1/urls/:shortCode
 * Delete URL (requires authentication)
 */
router.delete("/:shortCode", authenticate, URLController.deleteURL);

export default router;

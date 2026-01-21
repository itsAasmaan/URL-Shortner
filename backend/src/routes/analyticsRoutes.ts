import { Router } from 'express';
import AnalyticsController from '../controllers/AnalyticsController.js';

const router = Router();

/**
 * GET /api/v1/analytics/recent
 * Get recent activity across all URLs
 */
router.get('/recent', AnalyticsController.getRecentActivity);

export default router;
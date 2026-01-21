import { Request, Response } from "express";
import AnalyticsService from "../services/AnalyticsService.js";
import { asyncHandler } from "../middleware/errorHandler.js";

class AnalyticsController {
  /**
   * Get URL statistics
   * GET /api/v1/urls/:shortCode/stats
   */
  getURLStats = asyncHandler(async (req: Request, res: Response) => {
    const shortCode = req.params.shortCode as string;
    const days = parseInt(req.query.days as string) || 30;

    const stats = await AnalyticsService.getURLStats(shortCode, days);

    res.json({
      success: true,
      data: stats,
    });
  });

  /**
   * Get detailed click history
   * GET /api/v1/urls/:shortCode/clicks
   */
  getClickHistory = asyncHandler(async (req: Request, res: Response) => {
    const shortCode = req.params.shortCode as string;
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await AnalyticsService.getClickHistory(shortCode, limit, offset);

    res.json({
      success: true,
      data: result.clicks,
      pagination: result.pagination,
    });
  });

  /**
   * Get recent activity across all URLs
   * GET /api/v1/analytics/recent
   */
  getRecentActivity = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;

    const activity = await AnalyticsService.getRecentActivity(limit);

    res.json({
      success: true,
      data: activity,
    });
  });
}

export default new AnalyticsController();

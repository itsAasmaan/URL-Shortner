import { Request, Response, NextFunction } from "express";
import URLService from "../services/URLService.js";
import AnalyticsService from "../services/AnalyticsService.js";
import URLRepository from "../repositories/URLRepository.js";
import { CreateURLDTO, AuthRequest } from "../types/index.js";
import { asyncHandler } from "../middleware/errorHandler.js";

class URLController {
  /**
   * Create a new shortened URL
   * POST /api/v1/urls
   */
  createURL = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data: CreateURLDTO = {
      url: req.body.url,
      customAlias: req.body.customAlias,
      expiresIn: req.body.expiresIn,
      userId: req.user?.id,
    };

    const result = await URLService.createURL(data);

    res.status(201).json({
      success: true,
      data: result,
      message: "URL shortened successfully",
    });
  });

  /**
   * Redirect to original URL
   * GET /:shortCode
   */
  redirectURL = asyncHandler(async (req: Request, res: Response) => {
    const shortCode = req.params.shortCode as string;
    const originalUrl = await URLService.getOriginalURL(shortCode);

    // Get URL ID for analytics
    const url = await URLRepository.findByShortCode(shortCode);
    if (url) {
      // Record analytics asynchronously
      AnalyticsService.recordClick({
        url_id: url.id,
        ip_address: req.ip,
        user_agent: req.get('user-agent'),
        referrer: req.get('referer'),
        country: AnalyticsService.getCountryFromIP(req.ip || ''),
      }).catch(err => {
      });
    }

    // Redirect to original URL
    res.redirect(301, originalUrl);
  });

  /**
   * Get URL details
   * GET /api/v1/urls/:shortCode
   */
  getURL = asyncHandler(async (req: Request, res: Response) => {
    const shortCode = req.params.shortCode as string;

    const urlDetails = await URLService.getURLDetails(shortCode);

    res.json({
      success: true,
      data: urlDetails,
    });
  });

  /**
   * Get user's URLs
   * GET /api/v1/urls
   */
  getUserURLs = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await URLService.getUserURLs(userId, page, limit);

    res.json({
      success: true,
      data: result.urls,
      pagination: result.pagination,
    });
  });

  /**
   * Delete URL
   * DELETE /api/v1/urls/:shortCode
   */
  deleteURL = asyncHandler(async (req: AuthRequest, res: Response) => {
    const shortCode = req.params.shortCode as string;
    const userId = req.user?.id;

    await URLService.deleteURL(shortCode, userId);

    res.json({
      success: true,
      message: "URL deleted successfully",
    });
  });

  /**
   * Update URL (e.g., deactivate/activate)
   * PUT /api/v1/urls/:shortCode
   */
  updateURL = asyncHandler(async (req: AuthRequest, res: Response) => {
    const shortCode = req.params.shortCode as string;
    const userId = req.user?.id;
    const { active } = req.body;

    // Get URL to verify ownership
    const url = await URLRepository.findByShortCode(shortCode);

    if (!url) {
      return res.status(404).json({
        success: false,
        error: "URL not found",
      });
    }

    // Verify ownership if authenticated
    if (userId && url.user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized to update this URL",
      });
    }

    // Update URL
    const updated = await URLRepository.update(url.id, {
      active: active,
    });

    res.json({
      success: true,
      data: {
        shortCode: updated?.short_code,
        active: updated?.active,
      },
      message: "URL updated successfully",
    });
  });
}

export default new URLController();

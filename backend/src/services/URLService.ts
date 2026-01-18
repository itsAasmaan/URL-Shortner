import URLRepository from "../repositories/URLRepository.js";
import Configuration from "../config/env.js";
import { CreateURLDTO, URLResponse, NotFoundError, ValidationError } from "../types/index.js";
import { isValidShortCode, generateShortCode } from "../utils/shortCodeGenerator.js";
import { sanitizeURL } from "../utils/validators.js";

class URLService {
  /**
   * Create a shortened URL
   */
  async createURL(data: CreateURLDTO): Promise<URLResponse> {
    try {
      const sanitizedURL = sanitizeURL(data.url);

      let shortCode: string;
      let isCustom: boolean = false;

      if (data.customAlias) {
        if (!isValidShortCode(data.customAlias)) {
          throw new ValidationError("Invalid custom alias format");
        }

        const exists = await URLRepository.existsByShortCode(data.customAlias);
        if (exists) {
          throw new ValidationError("Custom alias already taken");
        }

        shortCode = data.customAlias;
        isCustom = true;
      } else {
        // Generate short code - we'll use a temporary value for now, will implement a distributed ID generator later
        shortCode = "temp";
      }

      let expiresAt: Date | undefined;
      if (data.expiresIn) {
        expiresAt = new Date(Date.now() + data.expiresIn * 1000);
      } else {
        expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      }

      const url = await URLRepository.create({
        short_code: shortCode,
        original_url: sanitizedURL,
        alias: isCustom,
        user_id: data.userId,
        expires_at: expiresAt,
      });

      if (!isCustom) {
        shortCode = generateShortCode(url.id);
        await URLRepository.update(url.id, { short_code: shortCode });
      }

      return {
        shortCode,
        shortUrl: `${Configuration.baseURL}/${shortCode}`,
        originalUrl: sanitizedURL,
        createdAt: url.created_at,
        expiresAt,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get original URL by short code
   */
  async getOriginalURL(shortCode: string): Promise<string> {
    try {
      const url = await URLRepository.findByShortCode(shortCode);

      if (!url) {
        throw new NotFoundError("URL not found");
      }

      // Check if expired
      if (url.expires_at && new Date(url.expires_at) < new Date()) {
        // Deactivate expired URL
        await URLRepository.softDelete(url.id);
        throw new NotFoundError("URL has expired");
      }

      return url.original_url;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get URL details with statistics
   */
  async getURLDetails(shortCode: string): Promise<any> {
    try {
      const stats = await URLRepository.getStats(shortCode);

      if (!stats) {
        throw new NotFoundError("URL not found");
      }

      return {
        shortCode: stats.short_code,
        shortUrl: `${Configuration.baseURL}/${stats.short_code}`,
        originalUrl: stats.original_url,
        createdAt: stats.created_at,
        expiresAt: stats.expires_at,
        isActive: stats.active,
        totalClicks: parseInt(stats.total_clicks, 10),
        lastClicked: stats.last_clicked,
      };
    } catch (error) {
      throw error;
    }
  }

   /**
   * Get user's URLs
   */
  async getUserURLs(userId: string, page: number = 1, limit: number = 20): Promise<any> {
    try {
      const offset = (page - 1) * limit;
      const urls = await URLRepository.findByUserId(userId, limit, offset);
      const total = await URLRepository.countByUserId(userId);

      const formattedUrls = urls.map(url => ({
        shortCode: url.short_code,
        shortUrl: `${Configuration.baseURL}/${url.short_code}`,
        originalUrl: url.original_url,
        createdAt: url.created_at,
        expiresAt: url.expires_at,
        isActive: url.active,
      }));

      return {
        urls: formattedUrls,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete URL
   */
  async deleteURL(shortCode: string, userId?: string): Promise<void> {
    try {
      const url = await URLRepository.findByShortCode(shortCode);
      
      if (!url) {
        throw new NotFoundError('URL not found');
      }

      // If userId provided, verify ownership
      if (userId && url.user_id !== userId) {
        throw new ValidationError('Unauthorized to delete this URL');
      }

      await URLRepository.softDelete(url.id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Clean up expired URLs (run periodically)
   */
  async cleanupExpiredURLs(): Promise<number> {
    try {
      const count = await URLRepository.deactivateExpired();
      return count;
    } catch (error) {
      throw error;
    }
  }
}

export default new URLService();

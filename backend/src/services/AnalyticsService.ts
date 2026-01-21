import ClickRepository from "../repositories/ClickRepository.js";
import URLRepository from "../repositories/URLRepository.js";
import { CreateClickDTO, ClickStats, NotFoundError } from "../types/index.js";

class AnalyticsService {
  /**
   * Record a click/visit
   */
  async recordClick(data: CreateClickDTO): Promise<void> {
    try {
      await ClickRepository.create(data);
    } catch (error) {
      // No need to through errors - analytics failure shouldn't break redirection
    }
  }

  /**
   * Get click statistics for a URL
   */
  async getURLStats(shortCode: string, days: number = 30): Promise<ClickStats> {
    try {
      const url = await URLRepository.findByShortCode(shortCode);

      if (!url) {
        throw new NotFoundError("URL not found");
      }

      const stats = await ClickRepository.getStatsByUrlId(url.id, days);

      return stats;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get total clicks for a URL (with cache)
   */
  async getTotalClicks(urlId: number): Promise<number> {
    try {
      const count = await ClickRepository.countByUrlId(urlId);

      return count;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get detailed click history
   */
  async getClickHistory(shortCode: string, limit: number = 100, offset: number = 0): Promise<any> {
    try {
      const url = await URLRepository.findByShortCode(shortCode);

      if (!url) {
        throw new NotFoundError("URL not found");
      }

      const clicks = await ClickRepository.findByUrlId(url.id, limit, offset);
      const total = await ClickRepository.countByUrlId(url.id);

      return {
        clicks,
        pagination: {
          limit,
          offset,
          total,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get recent clicks across all URLs
   */
  async getRecentActivity(limit: number = 10): Promise<any[]> {
    try {
      const clicks = await ClickRepository.getRecentClicks(limit);

      return clicks;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Extract country from IP address (placeholder)
   * will use a GeoIP library like geoip-lite
   */
  getCountryFromIP(ip: string): string | undefined {
    // TODO: Implement actual GeoIP lookup
    // For now, returning undefined
    return undefined;
  }

  /**
   * Parse user agent (simple version)
   */
  parseUserAgent(userAgent: string): { browser?: string; os?: string } {
    // Simple user agent parsing
    // later will update and use a library like ua-parser-js
    const result: { browser?: string; os?: string } = {};

    if (userAgent.includes("Chrome")) result.browser = "Chrome";
    else if (userAgent.includes("Firefox")) result.browser = "Firefox";
    else if (userAgent.includes("Safari")) result.browser = "Safari";
    else if (userAgent.includes("Edge")) result.browser = "Edge";

    if (userAgent.includes("Windows")) result.os = "Windows";
    else if (userAgent.includes("Mac")) result.os = "macOS";
    else if (userAgent.includes("Linux")) result.os = "Linux";
    else if (userAgent.includes("Android")) result.os = "Android";
    else if (userAgent.includes("iOS")) result.os = "iOS";

    return result;
  }
}

export default new AnalyticsService();

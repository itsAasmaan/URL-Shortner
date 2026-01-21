import api from "./api";
import type { ClickStats, Click, APIResponse } from "../types";

class AnalyticsService {
  /**
   * Get URL statistics
   */
  async getURLStats(shortCode: string, days: number = 30): Promise<ClickStats> {
    const response = await api.get<APIResponse<ClickStats>>(`/api/v1/urls/${shortCode}/stats`, {
      params: { days },
    });
    return response.data.data!;
  }

  /**
   * Get click history
   */
  async getClickHistory(
    shortCode: string,
    limit: number = 100,
    offset: number = 0,
  ): Promise<{ clicks: Click[]; pagination: any }> {
    const response = await api.get<APIResponse<{ clicks: Click[]; pagination: any }>>(
      `/api/v1/urls/${shortCode}/clicks`,
      {
        params: { limit, offset },
      },
    );
    return response.data.data!;
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit: number = 10): Promise<any[]> {
    const response = await api.get<APIResponse<any[]>>("/api/v1/analytics/recent", {
      params: { limit },
    });
    return response.data.data!;
  }
}

export default new AnalyticsService();

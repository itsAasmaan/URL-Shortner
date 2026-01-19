import api from "./api";
import type { CreateURLRequest, CreateURLResponse, URL, APIResponse, PaginatedResponse } from "../types";

class URLService {
  /**
   * Create a shortened URL
   */
  async createURL(data: CreateURLRequest): Promise<CreateURLResponse> {
    const response = await api.post<APIResponse<CreateURLResponse>>("api/v1/urls", data);

    return response.data.data!;
  }

  /**
   * Get URL details
   */
  async getURL(shortCode: string): Promise<URL> {
    const response = await api.get<APIResponse<URL>>(`api/v1/urls/${shortCode}`);

    return response.data.data!;
  }

  /**
   * Get user's URLs
   */
  async getUserURLs(page: number = 1, limit: number = 20): Promise<PaginatedResponse<URL>> {
    const response = await api.get<PaginatedResponse<URL>>("/api/v1/urls", {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * Delete URL
   */
  async deleteURL(shortCode: string): Promise<void> {
    await api.delete(`/api/v1/urls/${shortCode}`);
  }

  /**
   * Update URL
   */
  async updateURL(shortCode: string, data: { active: boolean }): Promise<URL> {
    const response = await api.put<APIResponse<URL>>(`/api/v1/urls/${shortCode}`, data);
    return response.data.data!;
  }
}

export default new URLService();

import api from "./api";

interface AuthResponse {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class AuthenticationService {
  /**
   * Register a new user
   */
  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<APIResponse<AuthResponse>>("/api/v1/auth/register", { email, password });

    return response.data.data!;
  }

  /**
   * Get Current user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<APIResponse<AuthResponse>>("/api/v1/auth/login", { email, password });

    return response.data.data!;
  }

  /**
   * login an user
   */
  async getCurrentUser(): Promise<{ id: string; email: string }> {
    const response = await api.get<APIResponse<{ id: string; email: string }>>("/api/v1/auth/me");

    return response.data.data!;
  }

  /**
   * logout
   */
  async logout(): Promise<void> {
    await api.post("/api/v1/auth/me");
  }
}

export default new AuthenticationService();

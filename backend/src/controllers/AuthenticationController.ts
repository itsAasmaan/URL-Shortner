import { Request, Response } from "express";
import AuthenticationService from "../services/AuthenticationService.js";
import { AuthRequest } from "../types/index.js";
import { asyncHandler } from "../middleware/errorHandler.js";

class AuthenticationController {
  /**
   * Register a new user
   * POST /api/v1/auth/register
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await AuthenticationService.register({ email, password });

    res.status(201).json({
      success: true,
      data: result,
      message: "User registered successfully",
    });
  });

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await AuthenticationService.login(email, password);

    res.json({
      success: true,
      data: result,
      message: "Login successful",
    });
  });

  /**
   * Get current user
   * GET /api/v1/auth/me
   */
  getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated",
      });
    }

    const user = await AuthenticationService.getCurrentUser(userId);

    res.json({
      success: true,
      data: user,
    });
  });

  /**
   * Logout user
   * POST /api/v1/auth/logout
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    // In a stateless JWT system, logout is handled client-side
    res.json({
      success: true,
      message: "Logout successful",
    });
  });
}

export default new AuthenticationController();

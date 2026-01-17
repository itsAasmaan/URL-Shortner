import { Response, NextFunction } from "express";
import AuthenticationService from "../services/AuthenticationService.js";
import { AuthRequest, UnauthorizedError } from "../types/index.js";

/**
 * Verifies JWT token and adds user to request
 */
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization?.trim();

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.substring(7);

    const payload = AuthenticationService.verifyToken(token);

    req.user = {
      id: payload.id,
      email: payload.email,
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(401).json({
      success: false,
      error: "Authentication failed",
    });
  }
};

/**
 * Adds user to request if token is valid, but doesn't fail if no token
 */
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const payload = AuthenticationService.verifyToken(token);

      req.user = {
        id: payload.id,
        email: payload.email,
      };
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

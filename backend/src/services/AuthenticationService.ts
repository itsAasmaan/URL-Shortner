import jwt from "jsonwebtoken";
import userRepository from "../repositories/UserRepository.js";
import Configuration from "../config/env.js";
import { CreateUserDTO, ValidationError, UnauthorizedError } from "../types/index.js";

interface TokenPayload {
  id: string;
  email: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

class AuthenticationService {
  /**
   * Register a new user
   */
  async register(data: CreateUserDTO): Promise<AuthResponse> {
    try {
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new ValidationError("Email already exists.");
      }

      const user = await userRepository.create(data);

      const token = this.generateToken({
        id: user.id,
        email: user.email,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new UnauthorizedError("Invalid email or password.");
      }

      const isPasswordCorrect = await userRepository.verifyPassword(password, user.password);
      if (!isPasswordCorrect) {
        throw new UnauthorizedError("Invalid email or password.");
      }

      const token = this.generateToken({
        id: user.id,
        email: user.email,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current user by ID
   */
  async getCurrentUser(userId: string) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new UnauthorizedError("User not found");
      }

      return {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate JWT token
   */
  private generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, Configuration.jwt.secret, {
      expiresIn: Configuration.jwt.expiresIn,
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, Configuration.jwt.secret) as TokenPayload;
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired token");
    }
  }
}

export default new AuthenticationService();
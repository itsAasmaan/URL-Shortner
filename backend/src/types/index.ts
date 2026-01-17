import { Request } from "express";

// User Types
export interface User {
  id: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDTO {
  email: string;
  password: string;
}

// URL Types
export interface URL {
  id: number;
  short_code: string;
  original_url: string;
  custom_alias: boolean;
  user_id?: string;
  created_at: Date;
  expires_at?: Date;
  active: boolean;
}

export interface CreateURLDTO {
  url: string;
  customAlias?: string;
  expiresIn?: number; // in seconds
  userId?: string;
}

export interface URLResponse {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: Date;
  expiresAt?: Date;
}

// Click/Analytics Types
export interface Click {
  id: number;
  url_id: number;
  clicked_at: Date;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  country?: string;
}

export interface CreateClickDTO {
  url_id: number;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  country?: string;
}

export interface ClickStats {
  totalClicks: number;
  clicksByDay: { date: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  topCountries: { country: string; count: number }[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request with User
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// Rate Limit Types
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

// Validation Schemas
export interface URLValidationSchema {
  url: string;
  customAlias?: string;
  expiresIn?: number;
}

// Cache Types
export interface CachedURL {
  original_url: string;
  expires_at?: Date;
  is_active: boolean;
}

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
}

// Error Types
export class AppError extends Error {
  constructor(public statusCode: number, public message: string, public isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(404, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super(429, message);
  }
}

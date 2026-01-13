import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/index.js";

export const errorHandler = (error: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  }

  res.status(500).json({
    success: false,
    error: "Internal server error",
    ...(process.env.NODE_ENV === "development" && {
      message: error.message,
      stack: error.stack,
    }),
  });
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl,
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

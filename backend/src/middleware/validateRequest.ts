import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ValidationError } from "../types/index.js";

/**
 * Middleware to validate request body against Joi schema
 */
export function validateBody(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ");

      return next(new ValidationError(errorMessage));
    }

    req.body = value;
    next();
  };
}

/**
 * Middleware to validate query parameters
 */
export function validateQuery(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ");

      return next(new ValidationError(errorMessage));
    }

    req.query = value;
    next();
  };
}

/**
 * Middleware to validate route parameters
 */
export function validateParams(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ");

      return next(new ValidationError(errorMessage));
    }

    req.params = value;
    next();
  };
}

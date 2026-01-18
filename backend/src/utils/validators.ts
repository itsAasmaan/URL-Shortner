import Joi from "joi";

/**
 * User Registration schema
 */
export const registerUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "string.empty": "Email is requied.",
  }),

  password: Joi.string().min(8).max(128).required().messages({
    "string.min": "Password must be at least 8 characters.",
    "string.max": "Password is too long.",
    "string.empty": "Password is requied.",
  }),
});

/**
 * User login schema
 */
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "string.empty": "Email is requied.",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is requied.",
  }),
});

/**
 * URL validation schema
 */
export const createURLSchema = Joi.object({
  url: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .required()
    .max(2048)
    .messages({
      "string.uri": "Please provide a valid URL with http:// or https://",
      "string.empty": "URL is required.",
      "string.max": "URL is too long (max 2048 characters)",
    }),

  customAlias: Joi.string().alphanum().min(3).max(20).optional().messages({
    "string.alphanum": "Custom alias can only contain letters and numbers",
    "string.min": "Custom alias must be at least 3 characters",
    "string.max": "Custom alias must be at most 20 characters",
  }),

  expiresIn: Joi.number().integer().positive().max(31536000).optional().messages({
    "number.base": "Expiry time must be a number",
    "number.positive": "Expiry time must be positive",
    "number.max": "Expiry time cannot exceed 1 year",
  }),
});

/**
 * Validate URL format
 */
export const isValidURL = (url: string): boolean => {
  try {
    const urlObject = new URL(url);

    return urlObject.protocol === "http" || urlObject.protocol === "https";
  } catch (error) {
    return false;
  }
};

/**
 * Sanitize URL - remove dangerous protocols
 */
export const sanitizeURL = (url: string): string => {
  const trimmed = url.trim();

  // Block javascript:, data:, file: protocols
  const dangerousProtocols = ["javascript:", "data:", "file:", "vbscript:"];
  const lowerUrl = trimmed.toLowerCase();

  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      throw new Error("URL contains dangerous protocol");
    }
  }

  return trimmed;
};

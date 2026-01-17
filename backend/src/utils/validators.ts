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

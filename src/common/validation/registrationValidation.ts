import Joi from "joi";

export const userRegistrationSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .trim()
    .required()
    .messages({
      "string.base": "Username must be a string.",
      "string.empty": "Username is required.",
      "string.min": "Username must be at least 3 characters long.",
      "string.max": "Username must not exceed 30 characters.",
      "any.required": "Username is required.",
    }),

  email: Joi.string()
    .email()
    .trim()
    .required()
    .messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email is required.",
      "any.required": "Email is required.",
    }),

  password: Joi.string()
    .min(8)
    .required()
    .messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 8 characters long.",
      "any.required": "Password is required.",
    }),

  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match.",
      "any.required": "Confirm password is required.",
    }),

  image: Joi.string()
    .uri()
    .optional()
    .messages({
      "string.uri": "Image must be a valid URI.",
    }),

  role: Joi.string()
    .valid("user", "admin")
    .default("user")
    .messages({
      "any.only": "Role must be either 'user' or 'admin'.",
    }),
}).unknown(false);

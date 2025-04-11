import Joi from "joi";

export const userLoginSchema = Joi.object({
 

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
}).unknown(false);

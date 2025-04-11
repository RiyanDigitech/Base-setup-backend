import { Request, Response, NextFunction, RequestHandler } from "express";
import Joi from "joi";

export const validateRequest = (schema: Joi.ObjectSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message.replace(/\"/g, "")), 
      });
    } else {
      next();
    }
  };
};



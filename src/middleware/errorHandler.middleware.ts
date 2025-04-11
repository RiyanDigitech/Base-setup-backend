import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ApiError } from "../common/utils/ApiError";
import { ApiResponse } from "../common/utils/ApiResponse";

export const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  if (err instanceof ApiError) {
    res
      .status(err.statusCode)
      .json(new ApiResponse(err.statusCode, null, err.message));
    return; 
  }

  res.status(500).json(new ApiResponse(500, null, "Internal server error"));
};

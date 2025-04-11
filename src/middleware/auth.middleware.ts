import { Response, Request, NextFunction } from "express";
import { ApiError } from "../common/utils/ApiError";
import { ErrorResponse } from "../common/helpers/response";
import { statusCode } from "../common/helpers/statusCode";
import { asyncHandler } from "../common/utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.models";

export const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) throw new ApiError(statusCode.UnAuthorized, ErrorResponse.tokenNotAvailable);

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN as string) as JwtPayload;
  const user = await User.findById(decoded._id);
  if (!user) throw new ApiError(statusCode.NotFound, ErrorResponse.userNotExists);
  (req as any).user = user;
  next();
});

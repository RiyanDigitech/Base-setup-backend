import { NextFunction, Request, Response } from "express"
import { asyncHandler } from "../common/utils/asyncHandler"
import { User } from "../models/user.models"
import { ApiError } from "../common/utils/ApiError"
import { statusCode } from "../common/helpers/statusCode"
import { ErrorResponse } from "../common/helpers/response"

export const verifyRole = (roles: string[])=>{
    return asyncHandler( async (req: Request, res: Response, next: NextFunction)=>{
        const user = await User.findById((req as any).user?._id)
        if(!user || !roles.includes( (req as any).user?._id )){
            throw new ApiError(statusCode.Forbidden, ErrorResponse.unAuthorized)
        }
        next()
    })
}
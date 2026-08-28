import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body

    const user = await userService.registerUserIntoDB(payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: {
            user
        }
    })
})

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const {accessToken} =req.cookies

    const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_token)

    if (!verifiedToken.success || !verifiedToken.data) {
        throw new Error(verifiedToken.message || "Invalid token")
    }

    const userId = (verifiedToken.data as JwtPayload).id
    const profile = await userService.getMyProfileFromDB(userId)   

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile retrieved successfully",
        data: {
            profile
        }
    })

})

const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id as string
    const payload = req.body

    const updatedUser = await userService.updateMyProfileInDB(userId, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile updated successfully", 
        data: {
            updatedUser
        }
    })

})

export const userController = {
    registerUser,
    getMyProfile,
    updateMyProfile
}
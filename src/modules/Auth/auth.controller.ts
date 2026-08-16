import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";


const loginUser = catchAsync(async (req : Request, res: Response, next: NextFunction) => {
    const payload = req.body
    const loginResult = await userService.loginUser(payload)

    sendResponse(res, {
        success: true,
        message: "User login Successful",
        statusCode: httpStatus.OK,
        data: loginResult
    })

})

export const authController = {
    loginUser
}
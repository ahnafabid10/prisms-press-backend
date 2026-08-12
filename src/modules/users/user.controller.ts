import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";


const registerUser = async (req: Request, res: Response) => {
try {
        const payload =req.body

   const user = await userService.registerUserIntoDB(payload)

    res.status(httpStatus.CREATED).json({ 
        success: true,
        status: httpStatus.CREATED,
        message: "User registered successfully" ,
        data: {
            user
        }
    })
} catch (error) {
    console.error("Error registering user:", error)

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Error registering user",
        error: error instanceof Error ? error.message : "Unknown error"
    })
}
}

export const userController = {
    registerUser
}
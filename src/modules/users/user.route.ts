import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/enums";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";


const router = Router();


declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                id: string;
                role: Role;
            };
        }
    }
}

router.post("/register", userController.registerUser)

const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies
            || req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization?.split(" ")[1]
            : req.headers.authorization

        if (!token) {
            throw new Error("You are not logged in. please log in to get access.")
        }

        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_token)

        if (!verifiedToken.success) {
            throw new Error(verifiedToken.message || "Invalid token. Please log in again.")
        }

        const { email, name, id, role } = verifiedToken.data as JwtPayload

        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new Error("You do not have permission to access this resource.")
        }

        const user = await prisma.user.findUnique({
            where: {
                id,
                email, 
                name, 
                role
            }
        })

        if(!user){
            throw new Error ("User not found.Please Log in again")
        }

        if(user.activeStatus === "BLOCKED"){
            throw new Error ("Your account has been blocked. Please contact support.")
        }

        req.user = {
            email,
            name,
            id,
            role
        }

        next()

    }
    )
}

router.get("/me", 
    
//     (req: Request, res: Response, next: NextFunction) => {
//     const { accessToken } = req.cookies

//     const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_token)

//     if (!verifiedToken.success) {
//         throw new Error(verifiedToken.message || "Invalid token. Please log in again.")
//     }

//     const { email, name, id, role } = verifiedToken.data as JwtPayload

//     // const requiredRoles = ["ADMIN", "USER", "AUTHOR"]

//     const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR]

//     if (!requiredRoles.includes(role)) {
//         return res.status(403).json({
//             success: false,
//             statusCode: httpStatus.FORBIDDEN,
//             message: "Forbidden: You do not have permission to access this resource"
//         })
//     }

//     req.user = { email, name, id, role }

//     next()
// }, 

auth(Role.ADMIN, Role.AUTHOR, Role.USER),

userController.getMyProfile)


export const userRoutes = router
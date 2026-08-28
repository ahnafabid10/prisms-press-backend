
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { ILoginUser } from "./auth.interface"
import bcrypt from "bcrypt";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const loginUser = async (payload: ILoginUser) => {
    const { email, password } = payload;

    // const user = await prisma.user.findUnique({
    //     where: { email }
    // })
    // if (!user) {
    //     throw new Error("User not found");
    // }

    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    })

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Password is incorrect");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }



//     const accessToken = jwt.sign(jwtPayload, config.jwt_access_token, {
//         expiresIn: config.jwt_access_expires_in
//     } as SignOptions
// ) 

const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_token,
    config.jwt_access_expires_in as SignOptions
)

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_token,
        config.jwt_refresh_expires_in as SignOptions
    )

    return { accessToken, refreshToken }
}

const refreshToken = async(refreshToken : string) =>{

    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_token)
    
    if(!verifiedRefreshToken.success) {
        throw Error("Invalid refresh token")
    }

    const {id} = verifiedRefreshToken.data as JwtPayload

    const user = await prisma.user.findUniqueOrThrow({
        where: { id }
    })

    if(user.activeStatus === "BLOCKED"){
        throw new Error("User is blocked")
    }

    const jwtPayload = {
        id,
        name: user.name,
        email: user.email,
        role: user.role,
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_token,
        config.jwt_access_expires_in as SignOptions
    )

    return { accessToken}

}

export const authService = {
    loginUser,
    refreshToken
}
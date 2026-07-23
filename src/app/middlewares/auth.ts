import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../../../prisma/generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { verifyToken } from "../utils/jwtUtils";
import config from "../config";
import type { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { sendResponse } from "../utils/sendResponse";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                name: string,
                email: string,
                role: UserRole
            }
        }
    }
}



export const auth = (...requiredRoles: UserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ? req.cookies.accessToken
            : req.headers.authorization?.includes('Bearer') ? req.headers.authorization.split(' ')[1]
                : req.headers.authorization;


        if (!token) {
            sendResponse(res, {
                success: false,
                statusCode: 404,
                message: "Token not found!"
            })
        }

        const verifiedToken = verifyToken(token, config.jwt_access_secret);

        if (!verifiedToken) {
            throw new Error("Invalid Token");
        }
        const user = verifiedToken.data as JwtPayload;


        const userExist = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        });

        if (!userExist) {
            throw new Error("User doesn't exist with this email.");
        }
        if (userExist.status === 'SUSPENDED') {
            throw new Error("Your account has been suspended. Please contact support for assistance.");
        }
        if (requiredRoles && !requiredRoles.includes(userExist.role)) {
            throw new Error("Forbidden")
        }


        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        next();
    });
}
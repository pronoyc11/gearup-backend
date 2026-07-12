import config from "../../config";
import { prisma } from "../../lib/prisma";
import type { IregisterPayload } from "./auth.interface"
import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { createToken } from "../../utils/jwtUtils";
import { UserStatus } from "../../../../prisma/generated/prisma/enums";

const registerUserInDB = async (payload: IregisterPayload) => {

    if (!payload) {
        throw new Error("Please provide required informations");
    }
    const { name, email, password, role, phone, address } = payload;

    if (role === "ADMIN") {
        throw new Error("Cannot register as Admin");
    }
    if (!name || !email || !password) {
        throw new Error("These are required fields");
    }

    const userExist = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (userExist) {
        throw new Error("User already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt));

    const createdUser = await prisma.user.create({
        data: {
            ...payload,
            password: hashedPassword
        },
        omit: {
            password: true
        }
    });


    return createdUser;

}

const loginUserInDB = async (payload: { email: string, password: string }) => {
    if (!payload) {
        throw new Error("Please provide required informations");
    }

    const { email } = payload;

    if (!email || !payload.password) {
        throw new Error("Required fields are missing!");
    }
    const userExist = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email
        }
    });

    const passwordCorrect = await bcrypt.compare(payload.password, userExist.password);

    if (!passwordCorrect) {
        throw new Error("Incorrect Password.");
    }

    if (userExist.status === UserStatus.SUSPENDED) {
        throw new Error("Your account is SUSPENDED");
    }

    const jwtPayload = {
        id: userExist.id,
        name: userExist.name,
        email: userExist.email,
        role: userExist.role
    }
    const { password, ...user } = userExist;
    const accessToken = createToken(jwtPayload, config.jwt_access_secret!, { expiresIn: config.jwt_access_expires_in } as SignOptions)
    return { accessToken, user };

}
export const authService = {
    registerUserInDB,
    loginUserInDB
}
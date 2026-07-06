import type { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export const createToken = (payload: JwtPayload, secret: string, expiresIn: SignOptions) => {

    const token = jwt.sign(payload, secret, expiresIn);

    return token;

}


export const verifyToken = (token: string, secret: string) => {

    try {
        const verified = jwt.verify(token, secret);

        return {
            success: true,
            data: verified
        }
    } catch (error: any) {
        return {
            success: false,
            error: error
        }
    }
}
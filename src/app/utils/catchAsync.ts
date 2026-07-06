import type { NextFunction, Request, RequestHandler, Response } from "express";
import { sendResponse } from "./sendResponse";



export const catchAsync = (fn: RequestHandler) => {

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);

        } catch (error: any) {

            sendResponse(res, {
                success: false,
                statusCode: 400,
                message: error.message,
                error: error
            })
        }
    }
}

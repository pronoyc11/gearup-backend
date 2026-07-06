import type { NextFunction, Request, RequestHandler, Response } from "express";



export const catchAsync = (fn: RequestHandler) => {

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);

        } catch (error: any) {

            res.status(500).json({
                success: false,
                message: error.message,
                error: error,
                pattern: "This is commone error response"
            })
        }
    }
}

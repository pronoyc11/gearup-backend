import type { Response } from "express";


type Tresponse<T> = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
    error?: T;
}



export const sendResponse = <T>(res: Response, payload: Tresponse<T>) => {

    if (payload.data && !payload.error) {
        return res.status(payload.statusCode).json({
            success: payload.success,
            message: payload.message,
            data: payload.data
        })
    }
    return res.status(payload.statusCode).json({
        success: payload.success,
        message: payload.message,
        error: payload.error
    })

}
import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const payload = req.body;


    const result = await authService.registerUserInDB(payload);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User registered successfully.",
        data: result
    })


});

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;


    const result = await authService.loginUserInDB(payload);
    
    res.cookie("accessToken",result.accessToken,{
         httpOnly: true,
        sameSite: "none",
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    })
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User logged in successfully.",
        data: result
    })
})

export const authController = {
    registerUser,
    loginUser
}
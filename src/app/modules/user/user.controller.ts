import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";




const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const profile = await userService.getMyProfileFromDB(id as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Profile found.",
        data: profile
    })
})

export const userController = {
    getMyProfile
}
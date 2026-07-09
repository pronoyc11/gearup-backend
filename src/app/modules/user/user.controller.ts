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

const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const profile = await userService.updateMyProfile(id as string, req.body);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Profile updated.",
        data: profile
    })
})
const deleteMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const profile = await userService.deleteMyProfile(id as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Profile deleted.",
        data: profile
    })
})
export const userController = {
    getMyProfile,
    updateMyProfile,
    deleteMyProfile
}
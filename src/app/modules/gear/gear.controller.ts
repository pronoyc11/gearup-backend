import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { gearService } from "./gear.service";
import { sendResponse } from "../../utils/sendResponse";



const createGearItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const providerId = req.user?.id;
    const gear = await gearService.createGearItem(providerId as string, req.body);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Gear created Successfully.",
        data: gear
    })
});


export const gearController = {
    createGearItem
}
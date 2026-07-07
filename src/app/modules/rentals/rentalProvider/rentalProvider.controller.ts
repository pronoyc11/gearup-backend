import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { rentalProviderService } from "./rentalProvider.service";
import { sendResponse } from "../../../utils/sendResponse";



const getMyRentalOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await rentalProviderService.viewProviderRentals(req.user?.id as string);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "all rental orders are listed.",
        data: result
    })
})

const updateRentalOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const providerId = req.user?.id;
    const { orderId } = req.params;

    const updatedOrder = await rentalProviderService.updateRentalOrderStatus(orderId as string, providerId as string, req.body);


    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Order status updated successfully",
        data: updatedOrder
    })
})
export const rentalProviderController = {
    getMyRentalOrders,
    updateRentalOrderStatus
}
import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { rentalProviderService } from "./rentalProvider.service";
import { sendResponse } from "../../../utils/sendResponse";



const getMyRentalOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await rentalProviderService.viewProviderRentals(req.user?.id as string, req.user?.role === "ADMIN");
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "all rental orders are listed.",
        data: result
    })
})

const updateRentalOrderItemStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const providerId = req.user?.id;
    const { itemId } = req.params;

    const updatedOrder = await rentalProviderService.updateRentalOrderItemStatus(itemId as string, providerId as string, req.user?.role === "ADMIN", req.body);


    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Order status updated successfully",
        data: updatedOrder
    })
})

const rentalOrderDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const orderId = req.params.orderId;
    const myRental = await rentalProviderService.rentalOrderDetails(orderId as string, id as string, req.user?.role === "ADMIN");
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Rental Order retrieved successfully",
        data: myRental
    })
})
export const rentalProviderController = {
    getMyRentalOrders,
    updateRentalOrderItemStatus,
    rentalOrderDetails
}

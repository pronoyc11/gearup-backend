import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { rentalCustomerService } from "./rentalCustomer.service";
import { sendResponse } from "../../../utils/sendResponse";



const createRentalOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {



    const id = req.user?.id;
    const result = await rentalCustomerService.createRentalOrder(id as string, req.body);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Rental Order created successfully",
        data: result
    })
})

const seeMyRentals = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;

    const myRentals = await rentalCustomerService.seeMyRentals(id as string);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Rental Orders retrieved successfully",
        data: myRentals
    })
})
const cancelOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const orderId = req.params.orderId;
    const myRentals = await rentalCustomerService.cancelOrder(id as string, orderId as string, req.body);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Rental Orders updated successfully",
        data: myRentals
    })
})
export const rentalController = {
    createRentalOrder,
    seeMyRentals,
    cancelOrder
}
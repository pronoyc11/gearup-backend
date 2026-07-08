import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";



const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const customerId = req.user?.id;
    const result = await reviewService.createReview(customerId as string, req.body)

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Review creted successfully",
        data: result
    })
})

const getAllReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const gearId = req.params.gearId;
    const result = await reviewService.getAllReviews(gearId as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Reviews retrieved successfully",
        data: result
    })
})
export const reviewController = {
    createReview,
    getAllReviews
}
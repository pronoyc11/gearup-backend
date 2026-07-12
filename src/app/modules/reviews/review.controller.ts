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
        message: "Review created successfully",
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

const updateReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const reviewId = req.params.reviewId;
    const userId = req.user?.id;
    const payload = req.body;

    const result = await reviewService.updateReview(reviewId as string, userId as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Review updated successfully",
        data: result
    })
})
export const reviewController = {
    createReview,
    getAllReviews,
    updateReview
}
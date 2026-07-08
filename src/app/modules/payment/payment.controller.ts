import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import config from "../../config";


const checkOut = catchAsync(async (req: Request, res: Response
) => {

    const result = await paymentService.createCheckoutSession(
        req.body.rentalOrderId,
        req.user?.id as string
    );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Checkout session created successfully",
        data: result
    })

});

const handleWebhook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const payload = req.body;
    const signature = req.headers['stripe-signature'];
    const webhookSecret = config.stripe_webhook_secret;
    await paymentService.handleWebhook(payload, signature as string, webhookSecret as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Checkout completed successfully."
    })

})

const viewOwnPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.viewOwnPayment(req.user?.id as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Your payments retrieved successfully",
        data: result
    })

})
export const paymentController = {
    checkOut,
    handleWebhook,
    viewOwnPayment
}
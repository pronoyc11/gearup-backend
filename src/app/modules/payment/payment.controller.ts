import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { stripe } from "../../lib/stripe";


const checkOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const products = await stripe.prices.list({
        limit: 1
    });


    console.log(products.data);


})


export const paymentController = {
    checkOut
}
import { prisma } from "../../lib/prisma";
import type { IReview } from "./review.interface";



const createReview = async (customerId: string, payload: IReview) => {

    const { gearId,
        rentalOrderId,
        rating,
        comment, } = payload;

    if (!rating || !gearId || !rentalOrderId) {
        throw new Error("This fields are required!");
    }
    const rental = await prisma.rentalOrder.findUnique({
        where: {
            id: rentalOrderId
        }
    })
    if (!rental) {
        throw new Error("You didn't rent yet.");
    }
    if (rental.customerId !== customerId) {
        throw new Error("You don't own this rental!")
    }
    if (rental.gearId !== gearId) {
        throw new Error("Uh oh, This is not the item you rented!")
    }

    const createdReview = await prisma.review.create({
        data:{
            customerId,
            ...payload,
            comment:comment?? null
        }
    })

}
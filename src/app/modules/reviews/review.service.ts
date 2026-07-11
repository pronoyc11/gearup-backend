import { prisma } from "../../lib/prisma";
import type { IReview } from "./review.interface";



const createReview = async (customerId: string, payload: IReview) => {
    if (!payload) {
        throw new Error("Must provide payload!");
    }
    const { gearId,
        rentalOrderId,
        rating,
        comment, } = payload;

    if (!rating || !gearId || !rentalOrderId) {
        throw new Error("Some required fields are missing!");
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
    if (rental.status !== 'RETURNED') {
        throw new Error("You have to return the product first, Then review.")
    }
    if (rental.gearId !== gearId) {
        throw new Error("Uh oh, This is not the item you rented!")
    }
    if (rating > 5 || rating < 1) {
        throw new Error("You can only rate out of 5.");
    }
    const createdReview = await prisma.review.create({
        data: {
            customerId,
            ...payload
        }
    });

    return createdReview;


}

const getAllReviews = async (gearId: string) => {

    const getAllReviews = await prisma.review.findMany({
        where: {
            gearId
        },
        include: {
            customer: {
                select: {
                    name: true
                }
            },
            gear: {
                select: {
                    title: true
                }
            }

        }
    });

    if (getAllReviews.length === 0) {
        throw new Error("No reviews yet.");
    }
    return getAllReviews;
}

export const reviewService = {
    createReview,
    getAllReviews
}
import { prisma } from "../../lib/prisma";
import type { IReview, IReviewUpdate } from "./review.interface";



const createReview = async (customerId: string, payload: IReview) => {
    if (!payload) {
        throw new Error("Must provide review!");
    }
    const {
        rentalOrderItemId,
        rating,
        comment, } = payload;

    if (!rating || !rentalOrderItemId) {
        throw new Error("Some required fields are missing!");
    }
    const rentalItem = await prisma.rentalOrderItem.findUnique({
        where: {
            id: rentalOrderItemId
        },
        include: {
            rentalOrder: true
        }
    })
    if (!rentalItem) {
        throw new Error("You didn't rent this item yet.");
    }
    if (rentalItem.rentalOrder.customerId !== customerId) {
        throw new Error("You don't own this rental!")
    }
    if (rentalItem.status !== 'RETURNED' && rentalItem.status !== 'LATE_RETURN') {
        throw new Error("You have to return the product first, Then review.")
    }
    if (rating > 5 || rating < 1) {
        throw new Error("You can only rate out of 5.");
    }
    const createdReview = await prisma.review.create({
        data: {
            customerId,
            gearId: rentalItem.gearId,
            rentalOrderItemId,
            rating,
            comment: comment ?? null
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

const updateReview = async (reviewId: string, userId: string, payload: IReviewUpdate) => {
    if (!payload) {
        throw new Error("Must provide review information to update.");
    }
    const { rating, comment } = payload;

    if (rating && (rating > 5 || rating < 1)) {
        throw new Error("You can only rate out of 5.");
    }
    if (!rating && !comment) {
        throw new Error("At least one field is required");
    }
    const reviewExists = await prisma.review.findUnique({
        where: {
            id: reviewId
        }
    });

    if (!reviewExists) {
        throw new Error("No review exists with this id.");
    }

    if (reviewExists!.customerId !== userId) {
        throw new Error("You don't own this review!");
    }

    const updatedReview = await prisma.review.update({
        where: {
            id: reviewId
        },
        data: {
            ...payload
        }
    });

    return updatedReview;
}

const deleteReview = async (reviewId: string, userId: string) => {
    const reviewExists = await prisma.review.findUnique({
        where: {
            id: reviewId
        }
    });
    if (!reviewExists) {
        throw new Error("No review exists with this id.");
    }
    if (reviewExists.customerId !== userId) {
        throw new Error("You don't own this review!");
    }
    await prisma.review.delete({
        where: {
            id: reviewId
        }
    });

    return null;

}

export const reviewService = {
    createReview,
    getAllReviews,
    updateReview,
    deleteReview
}

import { RentalStatus } from "../../../../../prisma/generated/prisma/enums";
import { prisma } from "../../../lib/prisma"
import { validateRentalStatusTransition } from "../../../utils/rentalUtils";



const viewProviderRentals = async (providerId: string) => {

    const allRentals = await prisma.rentalOrder.findMany({
        where: {
            gear: {
                providerId
            }
        },
        include: {
            customer: true,
            gear: true,
            payment: true
        }
    });
    if (allRentals.length === 0) {
        throw new Error("No orders for you yet");
    }
    return allRentals;
}

const updateRentalOrderStatus = async (orderId: string, providerId: string, payload: { status: RentalStatus }) => {

    const transactionResult = await prisma.$transaction(async (tx) => {
        const rentalOrderExists = await tx.rentalOrder.findUnique({
            where: {
                id: orderId
            },
            include: {
                gear: {
                    select: {
                        providerId: true
                    }
                }
            }
        });

        if (!rentalOrderExists) {
            throw new Error("No such order exits on this id");
        }

        if (rentalOrderExists.gear.providerId !== providerId) {
            throw new Error("Uh Oh, Not your order.");
        }
        if (!payload) {
            throw new Error("Prefered status is required!");
        }
        if (payload.status === 'PAID') {
            throw new Error("Sorry, You can't manually set the PAID status.")
        }
        if (!validateRentalStatusTransition(rentalOrderExists.status, payload.status)) {
            throw new Error(`Can't change the order status from ${rentalOrderExists.status} to ${payload.status}`);
        }

        const updatedOrder = await tx.rentalOrder.update({
            where: {
                id: orderId
            },
            data: {
                ...payload
            }
        })

        switch (payload.status) {
            case RentalStatus.CONFIRMED:
                await tx.gear.update({
                    where: {
                        id: rentalOrderExists?.gearId
                    },
                    data: {
                        stock: {
                            decrement: Number(rentalOrderExists.quantity)
                        }
                    }

                })
                break;
            case RentalStatus.RETURNED || RentalStatus.LATE_RETURN:
                await tx.gear.update({
                    where: {
                        id: rentalOrderExists?.gearId
                    },
                    data: {
                        stock: {
                            increment: Number(rentalOrderExists.quantity)
                        }
                    }

                })
                break;
            default:
                break;
        }

        return updatedOrder;
    });

    return transactionResult;
}
const rentalOrderDetails = async (rentalId: string, userId: string) => {
    const rental = await prisma.rentalOrder.findUnique({
        where: {
            id: rentalId
        },
        include: {
            gear: {
                select: {
                    title: true,
                    categoryId: true,
                    stock: true,
                    availability: true

                }
            },
            customer: {
                select: {
                    name: true,
                    email: true,
                    phone: true
                }
            }
        }
    })
    if (!rental) {
        throw new Error("No order found on this id!");
    }
    if (rental.customerId !== userId) {
        throw new Error("Uh, oh. Not your rental.");
    }
    return rental;
}
export const rentalProviderService = {
    viewProviderRentals,
    updateRentalOrderStatus,
    rentalOrderDetails
}
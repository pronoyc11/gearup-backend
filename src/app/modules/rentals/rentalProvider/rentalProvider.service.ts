import { RentalStatus } from "../../../../../prisma/generated/prisma/enums";
import { prisma } from "../../../lib/prisma"
import { rentalUtls, validateRentalItemStatusTransition } from "../../../utils/rentalUtils";



const viewProviderRentals = async (providerId: string, isAdmin: boolean) => {

    const allRentals = await prisma.rentalOrderItem.findMany({
        where: isAdmin ? {} : { providerId },
        include: {
            gear: true,
            rentalOrder: {
                include: {
                    customer: {
                        omit: {
                            password: true
                        }
                    },
                    payment: true
                }
            }
        }
    });
    if (allRentals.length === 0) {
        throw new Error("No orders for you yet");
    }
    return allRentals;
}

const syncOrderStatus = async (tx: any, rentalOrderId: string) => {
    const items = await tx.rentalOrderItem.findMany({
        where: {
            rentalOrderId
        },
        select: {
            status: true
        }
    });

    const payment = await tx.payment.findUnique({
        where: {
            orderId: rentalOrderId
        }
    });

    const status = rentalUtls.deriveOrderStatusFromItems(
        items.map((item: { status: RentalStatus }) => item.status),
        payment?.status === "SUCCESS"
    );

    await tx.rentalOrder.update({
        where: {
            id: rentalOrderId
        },
        data: {
            status
        }
    });
}

const updateRentalOrderItemStatus = async (itemId: string, providerId: string, isAdmin: boolean, payload: { status: RentalStatus }) => {

    const transactionResult = await prisma.$transaction(async (tx) => {
        const rentalOrderItemExists = await tx.rentalOrderItem.findUnique({
            where: {
                id: itemId
            },
            include: {
                rentalOrder: true,
                gear: true
            }
        });

        if (!rentalOrderItemExists) {
            throw new Error("No such order item exits on this id");
        }

        if (rentalOrderItemExists.providerId !== providerId && !isAdmin) {
            throw new Error("Uh Oh, Not your order item.");
        }
        if (!payload) {
            throw new Error("Prefered status is required!");
        }
        if (payload.status === 'PAID') {
            throw new Error("Sorry, You can't manually set the PAID status.")
        }
        if (!validateRentalItemStatusTransition(rentalOrderItemExists.status, payload.status)) {
            throw new Error(`Can't change the order item status from ${rentalOrderItemExists.status} to ${payload.status}`);
        }

        const updatedOrderItem = await tx.rentalOrderItem.update({
            where: {
                id: itemId
            },
            data: {
                ...payload
            },
            include: {
                gear: true,
                rentalOrder: true
            }
        })

        switch (payload.status) {
            case RentalStatus.CONFIRMED:
                await tx.gear.update({
                    where: {
                        id: rentalOrderItemExists.gearId
                    },
                    data: {
                        stock: {
                            decrement: rentalOrderItemExists.quantity
                        }
                    }

                })
                break;
            case RentalStatus.RETURNED:
            case RentalStatus.LATE_RETURN:
                await tx.gear.update({
                    where: {
                        id: rentalOrderItemExists.gearId
                    },
                    data: {
                        stock: {
                            increment: rentalOrderItemExists.quantity
                        }
                    }

                })
                break;
            default:
                break;
        }

        await syncOrderStatus(tx, rentalOrderItemExists.rentalOrderId);

        return updatedOrderItem;
    });

    return transactionResult;
}
const rentalOrderDetails = async (rentalId: string, userId: string, isAdmin: boolean) => {
    const rental = await prisma.rentalOrder.findUnique({
        where: {
            id: rentalId
        },
        include: {
            items: {
                where: isAdmin ? {} : {
                    providerId: userId
                },
                include: {
                    gear: true,
                    provider: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    review: true
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
    if (!isAdmin && rental.items.length === 0) {
        throw new Error("Uh, oh. Not your rental.");
    }
    return rental;
}
export const rentalProviderService = {
    viewProviderRentals,
    updateRentalOrderItemStatus,
    rentalOrderDetails
}

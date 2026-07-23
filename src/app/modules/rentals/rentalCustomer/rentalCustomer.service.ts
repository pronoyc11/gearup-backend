import { RentalStatus } from "../../../../../prisma/generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import { rentalUtls } from "../../../utils/rentalUtils";
import type { IRentalOrder } from "../rental.interface";


const createRentalOrder = async (customerId: string, payload: IRentalOrder) => {

    if (!payload) {
        throw new Error("Required fields are missing");
    }
    const {
        items,
        startDate,
        endDate
    } = payload;

    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error("At least one rental item is required.");
    }
    if (!startDate || !endDate) {
        throw new Error("Must provide all the required fields.")
    }
    if (!rentalUtls.isValidISODate(startDate) || !rentalUtls.isValidISODate(endDate)) {
        throw new Error("Provide a valid date format!");
    }

    const duplicateGearIds = new Set<string>();
    for (const item of items) {
        if (!item.gearId || !item.quantity) {
            throw new Error("Each item must include gearId and quantity.");
        }
        if (item.quantity < 1) {
            throw new Error("Quantity must be at least 1!!");
        }
        if (duplicateGearIds.has(item.gearId)) {
            throw new Error("Duplicate gear items are not allowed in the same rental order.");
        }
        duplicateGearIds.add(item.gearId);
    }

    //This format (YYYY-MM-DD)
    const convertedStartDate = new Date(startDate);
    const convertedEndDate = new Date(endDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (today > convertedStartDate) {
        throw new Error("Start date can't be in the past.");
    }


    const rentalDays = rentalUtls.rentalDays(convertedStartDate, convertedEndDate);


    if (!rentalDays.success) {
        throw new Error(rentalDays.error.message);
    }

    const gearIds = items.map((item) => item.gearId);

    const rentalOrder = await prisma.$transaction(async (tx) => {
        const gears = await tx.gear.findMany({
            where: {
                id: {
                    in: gearIds
                }
            },
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (gears.length !== gearIds.length) {
            throw new Error("One or more gear items were not found.");
        }

        const gearById = new Map(gears.map((gear) => [gear.id, gear]));
        const rentalItems = items.map((item) => {
            const gear = gearById.get(item.gearId);

            if (!gear) {
                throw new Error("No Gear found on such id.");
            }
            if (gear.availability !== 'AVAILABLE') {
                throw new Error(`${gear.title} is currently not available for renting`);
            }
            if (item.quantity > gear.stock) {
                throw new Error(`${gear.title} quantity exceeds available stock.`);
            }

            const subtotal = Number(gear.pricePerDay) * item.quantity * Number(rentalDays.data);

            return {
                gearId: gear.id,
                providerId: gear.providerId,
                quantity: item.quantity,
                pricePerDay: gear.pricePerDay,
                subtotal
            };
        });

        const totalAmount = rentalItems.reduce((sum, item) => sum + Number(item.subtotal), 0);

        return tx.rentalOrder.create({
            data: {
                customerId,
                totalAmount,
                startDate: convertedStartDate,
                endDate: convertedEndDate,
                status: RentalStatus.PLACED,
                items: {
                    create: rentalItems
                }
            },
            include: {
                items: {
                    include: {
                        gear: true,
                        provider: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
    });

    return {
        rentalDays: rentalDays.data,
        rentalOrder
    }


}

const seeMyRentals = async (customerId: string) => {


    const myRentals = await prisma.rentalOrder.findMany({
        where: {
            customerId
        },
        include: {
            items: {
                include: {
                    gear: true,
                    provider: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            },
            payment: true
        }
    });

    return myRentals;
}

const cancelOrder = async (customerId: string, orderId: string) => {
    const rentalOrderExists = await prisma.rentalOrder.findUnique({
        where: {
            id: orderId
        }
    })
    if (!rentalOrderExists) {
        throw new Error("No order exists with this id.");
    }
    if (rentalOrderExists.customerId !== customerId) {
        throw new Error("Uh oh, You don't own this order")
    }
    if (rentalOrderExists.status !== "PLACED") {
        throw new Error("You can only cancel the order after it being placed");
    }




    const cancelOrder = await prisma.rentalOrder.update({
        where: {
            id: rentalOrderExists.id
        },
        data: {
            status: RentalStatus.CANCELLED,
            items: {
                updateMany: {
                    where: {},
                    data: {
                        status: RentalStatus.CANCELLED
                    }
                }
            }
        },
        include: {
            items: {
                include: {
                    gear: true
                }
            }
        }
    })

    return cancelOrder;
}

const rentalOrderDetails = async (rentalId: string, userId: string) => {
    const rental = await prisma.rentalOrder.findUnique({
        where: {
            id: rentalId
        },
        include: {
            items: {
                include: {
                    gear: true,
                    provider: {
                        omit: {
                            password: true
                        }
                    },
                    review: true
                }
            },
            payment: true
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
export const rentalCustomerService = {
    createRentalOrder,
    seeMyRentals,
    cancelOrder,
    rentalOrderDetails
}

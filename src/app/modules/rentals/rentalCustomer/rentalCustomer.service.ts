import { RentalStatus } from "../../../../../prisma/generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import { rentalUtls } from "../../../utils/rentalUtils";
import type { IRentalOrder } from "../rental.interface";


const createRentalOrder = async (customerId: string, payload: IRentalOrder) => {

    const { gearId,
        quantity,
        startDate,
        endDate
    } = payload;

    const gearExists = await prisma.gear.findUnique({
        where: {
            id: gearId
        }
    });

    if (!gearExists) {
        throw new Error("No Gear found on such id.");
    }

    if (gearExists.availability !== 'AVAILABLE') {
        throw new Error("Currently this gear is not available for renting")
    }
    if (quantity > gearExists.stock) {
        throw new Error("Quantity limit exceeded.");
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

    const totalAmount = Number(gearExists.pricePerDay) * quantity * Number(rentalDays.data);

    const rentalOrder = await prisma.rentalOrder.create({
        data: {
            customerId,
            gearId,
            quantity,
            totalAmount,
            startDate: convertedStartDate,
            endDate: convertedEndDate,
            status: RentalStatus.PLACED
        },
        include: {
            gear: true
        }
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
            gear: true
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
            status: RentalStatus.CANCELLED
        }
    })

    return cancelOrder;
}
export const rentalCustomerService = {
    createRentalOrder,
    seeMyRentals,
    cancelOrder
}
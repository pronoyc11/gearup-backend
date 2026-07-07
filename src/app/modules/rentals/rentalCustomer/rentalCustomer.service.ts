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
        }
    });

    return myRentals;
}


export const rentalCustomerService = {
    createRentalOrder,
    seeMyRentals
}
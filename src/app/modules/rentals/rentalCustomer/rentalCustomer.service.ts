import { prisma } from "../../../lib/prisma";
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
    const convertedStartDate = new Date(startDate);

}
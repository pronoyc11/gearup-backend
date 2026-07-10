import { RentalStatus } from "../../../prisma/generated/prisma/enums";


const rentalDays = (startDate: Date, endDate: Date) => {
    try {

        if (endDate < startDate) {
            throw new Error("End date cannot be less than start date, Minimum 1 day rental is required!");
        }
        const diffInMs = endDate.getTime() - startDate.getTime()

        const rentalDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;

        return {
            success: true,
            data: rentalDays
        };
    } catch (error: any) {
        return {
            success: false,
            error: error
        };
    }
}

const rentalStatusTransition: Record<RentalStatus, RentalStatus[]> = {
    PLACED: [RentalStatus.CANCELLED, RentalStatus.CONFIRMED],
    CONFIRMED: [RentalStatus.PAID],
    PAID: [RentalStatus.PICKED_UP],
    PICKED_UP: [RentalStatus.RETURNED, RentalStatus.LATE_RETURN],
    RETURNED: [],
    LATE_RETURN: [],
    CANCELLED: []
}

export const validateRentalStatusTransition = (currentStatus: RentalStatus, nextStatus: RentalStatus) => {
    return rentalStatusTransition[currentStatus].includes(nextStatus);
}

const returnNewStartAndEndDate = (days: number) => {
    const startDate = new Date();
    const endDateInMS = startDate.getTime() + (1000 * 60 * 60 * 24 * days);
    const endDate = new Date(endDateInMS);

    return { startDate, endDate };
}

function isValidISODate(dateString: string): boolean {
    // 1. Check format using Regex (YYYY-MM-DD)
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    // 2. Check logical validity (e.g., no Feb 30)
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}
export const rentalUtls = {
    rentalDays,
    validateRentalStatusTransition,
    rentalStatusTransition,
    returnNewStartAndEndDate,
    isValidISODate
} 
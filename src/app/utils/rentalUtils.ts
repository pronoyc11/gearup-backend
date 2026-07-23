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
    PLACED: [RentalStatus.CANCELLED, RentalStatus.CONFIRMED, RentalStatus.PARTIALLY_CONFIRMED],
    PARTIALLY_CONFIRMED: [RentalStatus.CANCELLED, RentalStatus.CONFIRMED],
    CONFIRMED: [RentalStatus.PAID],
    PAID: [RentalStatus.PICKED_UP, RentalStatus.PARTIALLY_PICKED_UP],
    PARTIALLY_PICKED_UP: [RentalStatus.PICKED_UP, RentalStatus.PARTIALLY_RETURNED],
    PICKED_UP: [RentalStatus.RETURNED, RentalStatus.LATE_RETURN, RentalStatus.PARTIALLY_RETURNED],
    PARTIALLY_RETURNED: [RentalStatus.RETURNED, RentalStatus.LATE_RETURN],
    RETURNED: [],
    LATE_RETURN: [],
    CANCELLED: []
}

export const validateRentalStatusTransition = (currentStatus: RentalStatus, nextStatus: RentalStatus) => {
    return rentalStatusTransition[currentStatus].includes(nextStatus);
}

const rentalItemStatusTransition: Record<RentalStatus, RentalStatus[]> = {
    PLACED: [RentalStatus.CONFIRMED],
    PARTIALLY_CONFIRMED: [],
    CONFIRMED: [RentalStatus.PAID],
    PAID: [RentalStatus.PICKED_UP],
    PARTIALLY_PICKED_UP: [],
    PICKED_UP: [RentalStatus.RETURNED, RentalStatus.LATE_RETURN],
    PARTIALLY_RETURNED: [],
    RETURNED: [],
    LATE_RETURN: [],
    CANCELLED: []
}

export const validateRentalItemStatusTransition = (currentStatus: RentalStatus, nextStatus: RentalStatus) => {
    return rentalItemStatusTransition[currentStatus].includes(nextStatus);
}

const deriveOrderStatusFromItems = (itemStatuses: RentalStatus[], paymentSucceeded = false) => {
    if (itemStatuses.length === 0) {
        return RentalStatus.PLACED;
    }
    if (itemStatuses.every((status) => status === RentalStatus.CANCELLED)) {
        return RentalStatus.CANCELLED;
    }
    if (itemStatuses.every((status) => status === RentalStatus.RETURNED || status === RentalStatus.LATE_RETURN)) {
        return RentalStatus.RETURNED;
    }
    if (itemStatuses.some((status) => status === RentalStatus.RETURNED || status === RentalStatus.LATE_RETURN)) {
        return RentalStatus.PARTIALLY_RETURNED;
    }
    if (itemStatuses.every((status) => status === RentalStatus.PICKED_UP)) {
        return RentalStatus.PICKED_UP;
    }
    if (itemStatuses.some((status) => status === RentalStatus.PICKED_UP)) {
        return RentalStatus.PARTIALLY_PICKED_UP;
    }
    if (paymentSucceeded && itemStatuses.every((status) => status === RentalStatus.PAID)) {
        return RentalStatus.PAID;
    }
    if (itemStatuses.every((status) => status === RentalStatus.CONFIRMED || status === RentalStatus.PAID)) {
        return itemStatuses.every((status) => status === RentalStatus.PAID) ? RentalStatus.PAID : RentalStatus.CONFIRMED;
    }
    if (itemStatuses.some((status) => status === RentalStatus.CONFIRMED || status === RentalStatus.PAID)) {
        return RentalStatus.PARTIALLY_CONFIRMED;
    }
    return RentalStatus.PLACED;
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
    validateRentalItemStatusTransition,
    rentalStatusTransition,
    deriveOrderStatusFromItems,
    returnNewStartAndEndDate,
    isValidISODate
} 

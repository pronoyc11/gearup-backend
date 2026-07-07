import type { RentalStatus } from "../../../../prisma/generated/prisma/enums";



export interface IRentalOrder {

    gearId: string;
    quantity: number;
    startDate: string;
    endDate: string;
}
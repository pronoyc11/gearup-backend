import type { InputJsonValue } from "@prisma/client/runtime/client";
import type { GearAvailability } from "../../../../prisma/generated/prisma/enums";

export interface IgearItem {

    providerId?: string;
    categoryId: string;
    title: string;
    description: string;
    brand?: string;
    pricePerDay: number;
    stock: number;
    specifications: InputJsonValue;
    availability: GearAvailability
    image?: string
}
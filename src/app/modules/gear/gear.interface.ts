import type { InputJsonValue } from "@prisma/client/runtime/client";
import type { GearAvailability } from "../../../../prisma/generated/prisma/enums";
import type { GearWhereInput } from "../../../../prisma/generated/prisma/models";

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


export interface IGearQuery extends GearWhereInput {
    minPrice?: number;
    maxPrice?: number;
    categoryName?: string;
    searchTerm?: string;
    page?: string;
    limit?: string;
    sortOrder?: string;
    sortBy?: string;
}

export interface IgearUpdateItem {

    categoryId?: string;
    title?: string;
    description?: string;
    brand?: string;
    pricePerDay?: number;
    stock?: number;
    specifications?: InputJsonValue;
    availability?: GearAvailability
    image?: string
}
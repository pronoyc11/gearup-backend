import type { GearWhereInput } from "../../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma";
import type { IgearItem, IGearQuery, IgearUpdateItem } from "./gear.interface";



const createGearItem = async (providerId: string, payload: IgearItem) => {

    const {
        categoryId,
        title,
        description,
        brand,
        pricePerDay,
        stock,
        specifications,
        availability,
        image } = payload;

    if (!providerId
        || !categoryId ||
        !title ||
        !description ||
        !pricePerDay ||
        !stock ||
        !specifications ||
        !availability
    ) {
        throw new Error("Some required fields might be missing!");
    }

    // const providerExists = await prisma.user.findUnique({
    //     where: {
    //         id: providerId
    //     }
    // })

    // if (!providerExists) {
    //     throw new Error("Provider does not exist on this id");
    // }
    const categoryExists = await prisma.category.findUnique({
        where: {
            id: categoryId
        }
    })
    if (!categoryExists) {
        throw new Error("No category exists on this id.");
    }

    const createdGear = await prisma.gear.create({
        data: {
            providerId,
            categoryId,
            title,
            description,
            brand: brand ?? null,
            pricePerDay,
            stock,
            specifications,
            availability: availability ?? "AVAILABLE",
            image: image ?? null
        },
        include: {
            provider: {
                select: {
                    name: true
                }
            },
            category: {
                select: {
                    name: true
                }
            }
        }
    });

    return createdGear;

}


const getAllGearItems = async (query: IGearQuery) => {
    const limit = query.limit ? Number(query.limit) : 5;
    const skip = query.page ? (Number(query.page) - 1) * Number(limit) : 0;
    const orderTerm = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "asc";

    const andConditions: GearWhereInput[] = [];

    if (query.searchTerm) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: query.searchTerm,
                        mode: "insensitive"
                    }


                },
                {
                    brand: {
                        contains: query.searchTerm,
                        mode: "insensitive"
                    }
                },
                {
                    description: {
                        contains: query.searchTerm,
                        mode: "insensitive"
                    },
                }
            ]
        })
    }
    if (query.minPrice && query.maxPrice) {
        andConditions.push({
            pricePerDay: {
                gte: query.minPrice,
                lte: query.maxPrice
            }
        });
    } else if (query.minPrice && !query.maxPrice) {
        andConditions.push({
            pricePerDay: {
                gte: query.minPrice,
            }
        });
    } else if (!query.minPrice && query.maxPrice) {
        andConditions.push({
            pricePerDay: {
                lte: query.maxPrice,
            }
        });
    }

    if (query.availability) {
        andConditions.push({
            availability: query.availability
        })
    }
    if (query.brand) {
        andConditions.push({
            brand: query.brand
        })
    }
    if (query.title) {
        andConditions.push({
            title: query.title
        })
    }
    if (query.categoryName) {
        andConditions.push({
            category: { name: query.categoryName }
        })
    }
    const allGears = await prisma.gear.findMany({
        where: {
            AND: andConditions


        },
        take: limit,
        skip,
        orderBy: {
            [orderTerm]: sortOrder
        },
        include: {
            provider: {
                select: {
                    name: true
                }
            },
            category: {
                select: {
                    name: true
                }
            }
        }
    });

    return allGears;
}

const getSingleGearByIdFromDB = async (gearId: string) => {
    const gear = await prisma.gear.findUniqueOrThrow({
        where: {
            id: gearId
        },
        include: {
            category: true,
            provider: {
                omit: {
                    password: true
                }
            }
        }
    });
    return gear;
}


const updateGearInDB = async (providerId: string, gearId: string, payload: IgearUpdateItem) => {

    if (!payload) {
        throw new Error("Please specify what you want to update!");
    }

    const gearExist = await prisma.gear.findUniqueOrThrow({
        where: {
            id: gearId
        },
        include: {
            provider: {
                select: {
                    id: true
                }
            }
        }
    });

    if (gearExist.provider.id !== providerId) {
        throw new Error("Sorry, You don't own this item.");
    }

    if (payload.categoryId) {
        const categoryExists = await prisma.category.findUnique({
            where: {
                id: payload.categoryId as string
            }
        })
        if (!categoryExists) {
            throw new Error("Provide a valid categoryId");
        }
    }
    const updateGearInDB = await prisma.gear.update({
        where: {
            id: gearId
        },
        data: {
            ...payload
        }
    })

    return updateGearInDB;

}


const deleteGearFromDB = async (providerId: string, gearId: string, isAdmin: boolean) => {

    const gearExist = await prisma.gear.findUniqueOrThrow({
        where: {
            id: gearId
        },
        include: {
            provider: {
                select: {
                    id: true
                }
            }
        }
    });

    if (gearExist.provider.id !== providerId && !isAdmin) {
        throw new Error("Sorry, You don't own this item.");
    }

    const deletedGear = await prisma.gear.delete({
        where: {
            id: gearId
        }
    })

    return deletedGear;

}
export const gearService = {
    createGearItem,
    getAllGearItems,
    getSingleGearByIdFromDB,
    updateGearInDB,
    deleteGearFromDB
}
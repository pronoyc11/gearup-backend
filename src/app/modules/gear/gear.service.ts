import { prisma } from "../../lib/prisma";
import type { IgearItem } from "./gear.interface";



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


export const gearService = {
    createGearItem
}
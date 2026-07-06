import { prisma } from "../../lib/prisma"


const createCategoryInDB = async (payload: { name: string, description?: string }) => {

    const category = await prisma.category.create({
        data: {
            ...payload
        }
    });

    return category;
}


const getAllCategoryFromDB = async () => {
    const allCategory = await prisma.category.findMany();

    return allCategory;
}
export const categoryService = {
    createCategoryInDB,
    getAllCategoryFromDB
}
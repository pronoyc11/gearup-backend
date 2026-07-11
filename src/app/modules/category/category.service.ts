import { prisma } from "../../lib/prisma"


const createCategoryInDB = async (payload: { name: string, description?: string }) => {

    if (!payload) {
        throw new Error("Must provide category!");
    }
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

const deleteCategory = async (categoryId: string) => {
    const categoryExists = await prisma.category.findUniqueOrThrow({
        where: {
            id: categoryId
        }
    });

    const deletedCategory = await prisma.category.delete({
        where: {
            id: categoryExists.id
        }
    });
    return null;
}
export const categoryService = {
    createCategoryInDB,
    getAllCategoryFromDB,
    deleteCategory
}
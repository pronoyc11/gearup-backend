import { prisma } from "../../lib/prisma"
import { Icategory } from "./category.interface";


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

const updateCategory = async (categoryId: string, payload: Icategory) => {

    if (!payload) {
        throw new Error("Must provide category information to update.");
    }
    const { name, description } = payload;

    if (!name && !description) {
        throw new Error("At least one field is required");
    }

    const categoryExists = await prisma.category.findUniqueOrThrow({
        where: {
            id: categoryId
        }
    })

    const updatedCategory = await prisma.category.update({
        where: {
            id: categoryId
        },
        data: {
            ...payload
        }
    })
    return updatedCategory;
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
    deleteCategory,
    updateCategory
}
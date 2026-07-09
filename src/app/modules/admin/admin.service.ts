import { prisma } from "../../lib/prisma"


const fetchAllUsers = async () => {
    const allUsers = await prisma.user.findMany({
        omit: {
            password: true
        }
    });

    return allUsers
}
const fetchSingleUser = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        omit: {
            password: true
        }
    });
    if (!user) {
        throw new Error("No user found on this id!");
    }
    return user;
}
const fetchAllGears = async (query: { limit?: string, page?: string }) => {

    const take = Number(query.limit) || 10;
    const skip = query.page ? (Number(query.page) - 1) * Number(query.limit) : 0;
    const allGears = await prisma.gear.findMany({
        take,
        skip
    });

    return allGears;
}
const fetchAllRentals = async (query: { limit?: string, page?: string }) => {
    const take = Number(query.limit) || 10;
    const skip = query.page ? (Number(query.page) - 1) * Number(query.limit) : 0;
    const allRentals = await prisma.rentalOrder.findMany({
        include: {
            customer: {
                omit: {
                    password: true
                }
            },
            gear: true,
            payment: true
        },
        take,
        skip
    });

    return allRentals;
}
export const adminService = {
    fetchAllUsers,
    fetchSingleUser,
    fetchAllGears,
    fetchAllRentals
}
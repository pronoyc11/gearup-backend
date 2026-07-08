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

    return user;
}
const fetchAllGears = async () => {
    const allGears = await prisma.gear.findMany();

    return allGears;
}
const fetchAllRentals = async () => {
    const allRentals = await prisma.rentalOrder.findMany({
        include: {
            customer: {
                omit: {
                    password: true
                }
            },
            gear: true,
            payment: true
        }
    });

    return allRentals;
}
export const adminService = {
    fetchAllUsers,
    fetchSingleUser,
    fetchAllGears,
    fetchAllRentals
}
import { UserStatus } from "../../../../prisma/generated/prisma/enums";
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
            items: {
                include: {
                    gear: true,
                    provider: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    review: true
                }
            },
            payment: true
        },
        take,
        skip
    });

    return allRentals;
}

const updateUserStatusByAdmin = async (userId: string, userStatus: { status: UserStatus }) => {
    const userExists = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    });
    if (!userStatus) {
        throw new Error("Please provide next status of the user.");
    }

    const { status } = userStatus;

    if (status !== 'ACTIVE' && status !== 'SUSPENDED') {
        throw new Error("Provide a valid status for the user");
    }
    if (userExists.status === status) {
        throw new Error(`Cannot change status from ${userExists.status} to ${status}`);
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            status
        }
    });
    return updatedUser;
}
export const adminService = {
    fetchAllUsers,
    fetchSingleUser,
    fetchAllGears,
    fetchAllRentals,
    updateUserStatusByAdmin
}

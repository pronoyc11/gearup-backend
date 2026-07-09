import { prisma } from "../../lib/prisma"
import { IUpdateUser } from "./user.interface";



const getMyProfileFromDB = async (userId: string) => {

    const profile = await prisma.user.findUnique({
        where: {
            id: userId
        },
        omit: {
            password: true
        }
    });

    return profile;

}

const updateMyProfile = async (userId: string, payload: IUpdateUser) => {
    const profileExists = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    })
    const updatedUser = await prisma.user.update({
        where: {
            id: profileExists.id
        },
        data: {
            ...payload
        }
    })
    return updatedUser;
}

const deleteMyProfile = async (userId: string) => {
    const userExists = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    })
    await prisma.user.delete({
        where: {
            id: userExists.id
        }
    });
    return null;
}
export const userService = {
    getMyProfileFromDB,
    updateMyProfile,
    deleteMyProfile
}
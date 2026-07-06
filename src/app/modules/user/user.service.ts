import { prisma } from "../../lib/prisma"



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

export const userService = {
    getMyProfileFromDB
}
import type { UserRole } from "../../../../prisma/generated/prisma/enums";


export interface IregisterPayload {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    address?: string;
}
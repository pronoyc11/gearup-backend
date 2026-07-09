import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";

const router = Router();
router.get("/me", auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), userController.getMyProfile);
router.patch("/update-profile", auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), userController.updateMyProfile);
router.delete("/delete-profile", auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), userController.deleteMyProfile);

export const userRouter = router
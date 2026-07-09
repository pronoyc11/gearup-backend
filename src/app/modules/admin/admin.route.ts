import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import { adminController } from "./admin.controller";


const router = Router();

router.get("/users", auth(UserRole.ADMIN), adminController.fetchAllUsers);
router.get("/users/:userId", auth(UserRole.ADMIN), adminController.fetchSingleUser);
router.get("/gear", auth(UserRole.ADMIN), adminController.fetchAllGears);
router.get("/rentals", auth(UserRole.ADMIN), adminController.fetchAllRentals);

//!ADMIN CAN ALSO DELETE OR CREATE CATEGORY IN THE category Module.

//admin suspend or activate user
export const adminRouter = router;
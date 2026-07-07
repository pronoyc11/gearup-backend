import { Router } from "express";
import { auth } from "../../../middlewares/auth";
import { UserRole } from "../../../../../prisma/generated/prisma/enums";
import { rentalController } from "./rentalCustomer.controller";

const router = Router();

router.post("/", auth(UserRole.CUSTOMER, UserRole.ADMIN), rentalController.createRentalOrder);
router.get("/", auth(UserRole.CUSTOMER, UserRole.ADMIN), rentalController.seeMyRentals);

export const rentalCustomerRouter = router;
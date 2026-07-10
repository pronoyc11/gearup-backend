import { Router } from "express";
import { auth } from "../../../middlewares/auth";
import { UserRole } from "../../../../../prisma/generated/prisma/enums";
import { rentalController } from "./rentalCustomer.controller";

const router = Router();

router.post("/", auth(UserRole.CUSTOMER, UserRole.ADMIN), rentalController.createRentalOrder);
router.get("/", auth(UserRole.CUSTOMER, UserRole.ADMIN), rentalController.seeMyRentals);
router.get("/:orderId", auth(UserRole.CUSTOMER, UserRole.ADMIN), rentalController.rentalOrderDetails)
// !TO add, customer should be able to cancle order after being placed only
router.patch("/cancel/:orderId", auth(UserRole.CUSTOMER), rentalController.cancelOrder)
export const rentalCustomerRouter = router;
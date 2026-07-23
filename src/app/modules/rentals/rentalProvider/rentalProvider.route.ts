import { Router } from "express";
import { UserRole } from "../../../../../prisma/generated/prisma/enums";
import { auth } from "../../../middlewares/auth";
import { rentalProviderController } from "./rentalProvider.controller";

const router = Router();

router.get("/", auth(UserRole.ADMIN, UserRole.PROVIDER), rentalProviderController.getMyRentalOrders);
router.patch("/items/:itemId", auth(UserRole.ADMIN, UserRole.PROVIDER), rentalProviderController.updateRentalOrderItemStatus)
router.get("/:orderId", auth(UserRole.ADMIN, UserRole.PROVIDER), rentalProviderController.rentalOrderDetails);
export const rentalProviderRouter = router;

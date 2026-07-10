import { Router } from "express";
import { UserRole } from "../../../../../prisma/generated/prisma/enums";
import { auth } from "../../../middlewares/auth";
import { rentalProviderController } from "./rentalProvider.controller";

const router = Router();

router.get("/", auth(UserRole.ADMIN, UserRole.PROVIDER), rentalProviderController.getMyRentalOrders);
router.get("/:orderId", auth(UserRole.ADMIN, UserRole.PROVIDER), rentalProviderController.rentalOrderDetails);
router.patch("/:orderId", auth(UserRole.ADMIN, UserRole.PROVIDER), rentalProviderController.updateRentalOrderStatus)
export const rentalProviderRouter = router;
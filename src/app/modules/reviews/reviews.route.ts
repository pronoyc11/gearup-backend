import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";

const router = Router();


router.post("/create", auth(UserRole.CUSTOMER, UserRole.ADMIN), reviewController.createReview);
router.get("/:gearId", reviewController.getAllReviews);
router.patch("/:reviewId", auth(UserRole.CUSTOMER, UserRole.ADMIN), reviewController.updateReview);
router.delete("/:reviewId", auth(UserRole.CUSTOMER, UserRole.ADMIN), reviewController.deleteReview);
export const reviewRouter = router;
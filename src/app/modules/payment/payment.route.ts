import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";

const router = Router();

router.post("/create-session", auth(UserRole.CUSTOMER,UserRole.ADMIN), paymentController.checkOut);

router.post("/webhook", paymentController.handleWebhook);

router.get("/",auth(UserRole.ADMIN,UserRole.CUSTOMER),paymentController.viewOwnPayment);

router.get("/:paymentId", auth(UserRole.CUSTOMER,UserRole.ADMIN), paymentController.getPaymentDetails)

export const paymentRouter = router;
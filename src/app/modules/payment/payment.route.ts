import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";

const router = Router();

router.post("/create-session", auth(UserRole.CUSTOMER), paymentController.checkOut);

router.post("/webhook", paymentController.handleWebhook);

router.get("/", paymentController.viewOwnPayment);
export const paymentRouter = router;
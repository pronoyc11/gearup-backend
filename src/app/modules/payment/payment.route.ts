import { Router } from "express";
import { paymentController } from "./payment.controller";

const router = Router();

router.post("/create-session",paymentController.checkOut);

export const paymentRouter = router;
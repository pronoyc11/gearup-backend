import express from "express";
import { authRouter } from "./app/modules/auth/auth.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./app/modules/user/user.route";
import { categoryRouter } from "./app/modules/category/category.route";
import { gearRouter } from "./app/modules/gear/gear.route";
import { rentalCustomerRouter } from "./app/modules/rentals/rentalCustomer/rentalCustomer.route";
import { rentalProviderRouter } from "./app/modules/rentals/rentalProvider/rentalProvider.route";
import { paymentRouter } from "./app/modules/payment/payment.route";

const app = express();


app.use("/api/payment/webhook", express.raw({ type: "application/json" }))
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/gear", gearRouter)
app.use("/api/rental/customer", rentalCustomerRouter);
app.use("/api/rental/provider", rentalProviderRouter);

//!Payment Routes
app.use("/api/payment", paymentRouter);
export default app;
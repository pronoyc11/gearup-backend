import express, { NextFunction, Request, Response, urlencoded } from "express";
import { authRouter } from "./app/modules/auth/auth.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./app/modules/user/user.route";
import { categoryRouter } from "./app/modules/category/category.route";
import { gearRouter } from "./app/modules/gear/gear.route";
import { rentalCustomerRouter } from "./app/modules/rentals/rentalCustomer/rentalCustomer.route";
import { rentalProviderRouter } from "./app/modules/rentals/rentalProvider/rentalProvider.route";
import { paymentRouter } from "./app/modules/payment/payment.route";
import { reviewRouter } from "./app/modules/reviews/reviews.route";
import { adminRouter } from "./app/modules/admin/admin.route";
import httpstatus from "http-status-codes";
import { Prisma } from "../prisma/generated/prisma/client";

const app = express();


app.use("/api/payment/webhook", express.raw({ type: "application/json" }))
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }))
app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to gear up backend"
    })
})

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/gear", gearRouter)
app.use("/api/rental/customer", rentalCustomerRouter);
app.use("/api/rental/provider", rentalProviderRouter);

//!Payment Routes
app.use("/api/payment", paymentRouter);


//Review Router
app.use("/api/review", reviewRouter);

//!Admin router
app.use("/api/admin", adminRouter);

//!Route not fouond
app.use((req: Request, res: Response) => {
    res.status(404).json({
        message: " Route not found ",
        path: req.originalUrl
    })
})
//!Global Error handleer
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("Error : ", err);

    let statusCode;
    let errorMessage = err.message || "Internal Server Error";
    let errorName = err.name || "Internal Server Error";
    // let errorDetails = err.stack
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpstatus.BAD_REQUEST;
        errorMessage = "You have provided incorrect field type or missing fields"
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = httpstatus.BAD_REQUEST,
                errorMessage = "Duplicate Key Error"
        } else if (err.code === "P2003") {
            statusCode = httpstatus.BAD_REQUEST,
                errorMessage = "Foreign key constraint failed"
        } else if (err.code === "P2025") {
            statusCode = httpstatus.BAD_REQUEST,
                errorMessage = "An operation failed because it depends on one or more records that were required but not found."
        }
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = httpstatus.UNAUTHORIZED;
            errorMessage = "Authentication failed against database server. Please Check Your Credentials"
        } else if (err.errorCode === "P1001") {
            statusCode = httpstatus.BAD_REQUEST;
            errorMessage = "Can't reach database server"
        }
    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = httpstatus.INTERNAL_SERVER_ERROR;
        errorMessage = "Error occurred during query execution"
    }





    res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: statusCode || httpstatus.INTERNAL_SERVER_ERROR,
        name: errorName,
        message: errorMessage,
        error: err.stack
    })
})

export default app;
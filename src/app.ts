import express from "express";
import { authRouter } from "./app/modules/auth/auth.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./app/modules/user/user.route";
import { categoryRouter } from "./app/modules/category/category.route";
import { gearRouter } from "./app/modules/gear/gear.route";

const app = express();

app.use(express.json());
app.use(cors())
app.use(cookieParser());


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/gear", gearRouter)

export default app;
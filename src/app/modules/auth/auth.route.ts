import { Router, type NextFunction, type Request, type Response } from "express";
import { authController } from "./auth.controller";
import jwt from "jsonwebtoken";
import config from "../../config";
import { verifyToken } from "../../utils/jwtUtils";
const router = Router();


router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser)

export const authRouter = router;
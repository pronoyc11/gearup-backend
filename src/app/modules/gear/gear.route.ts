import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import { gearController } from "./gear.controller";

const router = Router();

router.post("/", auth(UserRole.PROVIDER), gearController.createGearItem);

export const gearRouter = router;
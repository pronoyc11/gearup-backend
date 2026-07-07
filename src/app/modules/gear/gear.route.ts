import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import { gearController } from "./gear.controller";

const router = Router();

router.post("/", auth(UserRole.PROVIDER), gearController.createGearItem);
router.get("/", gearController.getAllGearItems);
router.get("/:gearId", gearController.getSingleGearById);
//PATCH
router.patch("/:gearId", auth(UserRole.PROVIDER, UserRole.ADMIN), gearController.updateGear);

//!DELETE 

router.delete("/:gearId", auth(UserRole.PROVIDER, UserRole.ADMIN), gearController.deleteGear)

export const gearRouter = router;
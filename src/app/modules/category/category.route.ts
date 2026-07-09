import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../prisma/generated/prisma/enums";
import { categoryController } from "./category.controller";

const router = Router();


router.post("/", auth(UserRole.ADMIN), categoryController.createCategory);
router.get("/", categoryController.getAllCategory);
router.delete("/categoryId", auth(UserRole.ADMIN), categoryController.deleteCategory);
export const categoryRouter = router;
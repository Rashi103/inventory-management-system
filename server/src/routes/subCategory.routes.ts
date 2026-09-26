
import { Router } from "express";
import { getSubCategories } from "../controllers/subCategory.controller";

const router = Router();

router.get("/", getSubCategories);

export default router;



import { Router } from "express";

import {
  getCategories,
  createCategory,
} from "../controllers/category.controller";

const router = Router();

// Get all categories
router.get("/", getCategories);

// Create a category
router.post("/", createCategory);

export default router;



import { Router } from "express";

import {
  getCategories,
  createCategory,
} from "../controllers/category.controller";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = Router();

// View categories
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Manager", "Inventory Staff"),
  getCategories
);

// Create category
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Manager", "Inventory Staff"),
  createCategory
);

export default router;

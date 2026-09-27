import { Router } from "express";

import { getSubCategories } from "../controllers/subCategory.controller";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = Router();

// View subcategories
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Manager", "Inventory Staff"),
  getSubCategories
);

export default router;




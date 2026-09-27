
import { Router } from "express";

import {
  createSalesReturn,
  getSalesReturns,
} from "../controllers/return.controller";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = Router();

// Get all sales returns
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Manager", "Sales Executive"),
  getSalesReturns
);

// Create a sales return
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Manager", "Sales Executive"),
  createSalesReturn
);

export default router;

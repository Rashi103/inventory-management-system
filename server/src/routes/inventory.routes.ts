import { Router } from "express";

import {
  getLowStockProducts,
  getInventory,
} from "../controllers/inventory.controller";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = Router();

// View inventory
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Manager", "Inventory Staff"),
  getInventory
);

// View low-stock products
router.get(
  "/low-stock",
  authenticateToken,
  authorizeRoles("Manager", "Inventory Staff"),
  getLowStockProducts
);

export default router;


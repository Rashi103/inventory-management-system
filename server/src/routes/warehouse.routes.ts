import { Router } from "express";

import {
  getWarehouses,
  createWarehouse,
} from "../controllers/warehouse.controller";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = Router();

// View warehouses
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Manager", "Inventory Staff"),
  getWarehouses
);

// Create warehouse
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Manager", "Inventory Staff"),
  createWarehouse
);

export default router;

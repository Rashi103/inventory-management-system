import { Router } from "express";

import {
  getPurchaseOrders,
  createPurchaseOrder,
} from "../controllers/purchase.controller";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = Router();

// ======================================================
// VIEW PURCHASE ORDERS
// ======================================================

router.get(
  "/",
  authenticateToken,
  authorizeRoles("Manager", "Inventory Staff"),
  getPurchaseOrders
);

// ======================================================
// CREATE PURCHASE ORDER
// ======================================================

router.post(
  "/",
  authenticateToken,
  authorizeRoles("Manager", "Inventory Staff"),
  createPurchaseOrder
);

export default router;

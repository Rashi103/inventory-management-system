import { Router } from "express";

import {
  getSuppliers,
  createSupplier,
} from "../controllers/supplier.controller";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = Router();

// View suppliers
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Manager", "Inventory Staff"),
  getSuppliers
);

// Create supplier
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Manager", "Inventory Staff"),
  createSupplier
);

export default router;


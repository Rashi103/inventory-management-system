
import { Router } from "express";

import {
  getTotalSales,
  createSale,
  getSales,
  getCustomerPerformance,
} from "../controllers/sales.controller";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = Router();

// ======================================================
// GET TOTAL SALES
// ======================================================

router.get(
  "/total",
  authenticateToken,
  authorizeRoles(
    "Manager",
    "Sales Executive",
    "Accountant"
  ),
  getTotalSales
);

// ======================================================
// GET CUSTOMER PURCHASE PERFORMANCE
// ======================================================

router.get(
  "/performance/customers",
  authenticateToken,
  authorizeRoles(
    "Manager",
    "Sales Executive",
    "Accountant"
  ),
  getCustomerPerformance
);

// ======================================================
// GET ALL SALES
// ======================================================

router.get(
  "/",
  authenticateToken,
  authorizeRoles(
    "Manager",
    "Sales Executive",
    "Accountant"
  ),
  getSales
);

// ======================================================
// CREATE SALES BILL
// ======================================================

router.post(
  "/",
  authenticateToken,
  authorizeRoles("Manager", "Sales Executive"),
  createSale
);

export default router;

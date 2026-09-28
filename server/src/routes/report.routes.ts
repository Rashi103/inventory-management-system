import { Router } from "express";

import {
  getStockSummary,
  getLowStockProducts,
  getExpiredInventory,
  getSalesSummary,
  getProductSalesSummary,
  getCustomerPurchaseSummary,
  getSalesPeriodReport,
} from "../controllers/report.controller";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = Router();

// Stock summary
router.get(
  "/stock",
  authenticateToken,
  authorizeRoles("Manager", "Accountant"),
  getStockSummary
);

// Low stock report
router.get(
  "/low-stock",
  authenticateToken,
  authorizeRoles("Manager", "Inventory Staff"),
  getLowStockProducts
);

// Expired inventory
router.get(
  "/expired",
  authenticateToken,
  authorizeRoles("Manager", "Inventory Staff"),
  getExpiredInventory
);

// Sales period report
// Supports: daily, weekly, monthly, yearly
router.get(
  "/sales",
  authenticateToken,
  authorizeRoles("Manager", "Sales Executive", "Accountant"),
  getSalesPeriodReport
);

// General sales summary
router.get(
  "/sales-summary",
  authenticateToken,
  authorizeRoles("Manager", "Accountant"),
  getSalesSummary
);

// Product sales performance
router.get(
  "/product-sales",
  authenticateToken,
  authorizeRoles("Manager", "Accountant"),
  getProductSalesSummary
);

// Customer purchase summary
router.get(
  "/customer-purchases",
  authenticateToken,
  authorizeRoles("Manager", "Accountant"),
  getCustomerPurchaseSummary
);

export default router;

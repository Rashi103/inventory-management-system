
import { Router } from "express";

import {
  createSalesDetail,
  getSalesPerformance,
} from "../controllers/salesDetail.controller";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = Router();

// ======================================================
// ADD PRODUCT TO SALES BILL
// ======================================================

router.post(
  "/",
  authenticateToken,
  authorizeRoles("Manager", "Sales Executive"),
  createSalesDetail
);

// ======================================================
// GET SALES PERFORMANCE
// ======================================================

router.get(
  "/performance",
  authenticateToken,
  authorizeRoles(
    "Manager",
    "Sales Executive",
    "Accountant"
  ),
  getSalesPerformance
);

export default router;


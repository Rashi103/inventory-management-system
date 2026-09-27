
import { Router } from "express";

import { createGoodsReceipt } from "../controllers/goodsReceipt.controller";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = Router();

// ======================================================
// CREATE GOODS RECEIPT
// ======================================================

router.post(
  "/",
  authenticateToken,
  authorizeRoles("Manager", "Inventory Staff"),
  createGoodsReceipt
);

export default router;


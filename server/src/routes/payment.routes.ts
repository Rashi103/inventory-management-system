
import { Router } from "express";

import { createPayment } from "../controllers/payment.controller";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles(
    "Manager",
    "Sales Executive",
    "Accountant"
  ),
  createPayment
);

export default router;


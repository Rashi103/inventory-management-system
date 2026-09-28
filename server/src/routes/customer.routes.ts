import { Router } from "express";

import {
  getCustomers,
  createCustomer,
} from "../controllers/customer.controller";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = Router();

// View customers
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Manager", "Sales Executive"),
  getCustomers
);

// Add customer
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Manager", "Sales Executive"),
  createCustomer
);

export default router;
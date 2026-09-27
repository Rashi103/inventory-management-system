import { Router } from "express";

import {
  getProducts,
  createProduct,
  updateProduct,
} from "../controllers/product.controller";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = Router();

// View products
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Manager", "Inventory Staff"),
  getProducts
);

// Create product
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Manager", "Inventory Staff"),
  createProduct
);

// Update product
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Manager", "Inventory Staff"),
  updateProduct
);

export default router;

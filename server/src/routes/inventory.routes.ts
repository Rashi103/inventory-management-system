
import { Router } from "express";
import { getLowStockProducts, getInventory } from "../controllers/inventory.controller";

const router = Router();

// Get all inventory
router.get("/", getInventory);

// Get low-stock products
router.get("/low-stock", getLowStockProducts);

export default router;


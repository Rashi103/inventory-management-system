import { Router } from "express";
import {
  getTotalSales,
  createSale,
  getSales,
} from "../controllers/sales.controller";

const router = Router();

router.get("/total", getTotalSales);
router.get("/", getSales);
router.post("/", createSale);

export default router;
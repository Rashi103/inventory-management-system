import { Router } from "express";

import {
  getTotalSales,
  createSale,
  getSales,
  getCustomerPerformance,
} from "../controllers/sales.controller";

const router = Router();

router.get("/total", getTotalSales);

router.get("/performance/customers", getCustomerPerformance);

router.get("/", getSales);

router.post("/", createSale);

export default router;
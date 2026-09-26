import { Router } from "express";
import {
  createSalesDetail,
  getProductPerformance,
} from "../controllers/salesDetail.controller";

const router = Router();

router.post("/", createSalesDetail);

router.get("/performance", getProductPerformance);

export default router;
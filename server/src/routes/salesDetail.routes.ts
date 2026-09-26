import { Router } from "express";
import { createSalesDetail } from "../controllers/salesDetail.controller";

const router = Router();

router.post("/", createSalesDetail);

export default router;
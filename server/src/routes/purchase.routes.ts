
import { Router } from "express";
import { getPurchaseOrders } from "../controllers/purchase.controller";

const router = Router();

router.get("/", getPurchaseOrders);

export default router;

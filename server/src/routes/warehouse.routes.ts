
import { Router } from "express";
import {
  getWarehouses,
  createWarehouse,
} from "../controllers/warehouse.controller";

const router = Router();

router.get("/", getWarehouses);
router.post("/", createWarehouse);

export default router;


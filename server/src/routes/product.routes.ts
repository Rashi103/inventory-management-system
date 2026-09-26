import { Router } from "express";

import {
  getProducts,
  createProduct,
  updateProduct,
} from "../controllers/product.controller";
const router = Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);

export default router;

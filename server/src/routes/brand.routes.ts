
import { Router } from "express";

import {
  getBrands,
  createBrand,
} from "../controllers/brand.controller";

const router = Router();

// Get all brands
router.get("/", getBrands);

// Create a brand
router.post("/", createBrand);

export default router;


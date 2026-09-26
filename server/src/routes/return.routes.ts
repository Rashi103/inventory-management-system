import { Router } from "express";
import { getReturns } from "../controllers/return.controller";

const router = Router();

router.get("/", getReturns);

export default router;
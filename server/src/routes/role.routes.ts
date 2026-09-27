import { Router } from "express";

import { getRoles } from "../controllers/role.controller";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = Router();

// View roles
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Manager"),
  getRoles
);

export default router;

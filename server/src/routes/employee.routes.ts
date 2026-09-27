import { Router } from "express";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  toggleEmployeeStatus,
} from "../controllers/employee.controller";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = Router();

// View employees
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Manager"),
  getEmployees
);

// Create employee
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Manager"),
  createEmployee
);

// Update employee
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Manager"),
  updateEmployee
);

// Activate / deactivate employee
router.patch(
  "/:id/status",
  authenticateToken,
  authorizeRoles("Manager"),
  toggleEmployeeStatus
);

export default router;


import { Router } from "express";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  toggleEmployeeStatus,
} from "../controllers/employee.controller";

const router = Router();

router.get("/", getEmployees);

router.post("/", createEmployee);

router.put("/:id", updateEmployee);

router.patch(
  "/:id/status",
  toggleEmployeeStatus
);

export default router;
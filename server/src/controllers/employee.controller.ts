import { Request, Response } from "express";
import prisma from "../../lib/prisma";

// GET all employees
export const getEmployees = async (_req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        role: true,
        userLogin: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);

    res.status(500).json({
      message: "Failed to fetch employees",
    });
  }
};

// CREATE an employee
export const createEmployee = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      roleId,
    } = req.body;

    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        phone,
        address,
        roleId: Number(roleId),
      },
      include: {
        role: true,
      },
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error("Error creating employee:", error);

    res.status(500).json({
      message: "Failed to create employee",
    });
  }
};

export const updateEmployee = async (
  req: Request,
  res: Response
) => {
  try {
    const employeeId = Number(req.params.id);

    const {
      name,
      email,
      phone,
      address,
      roleId,
      isActive,
    } = req.body;

    const employee = await prisma.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        name,
        email,
        phone,
        address,
        roleId: Number(roleId),
        isActive,
      },
      include: {
        role: true,
        userLogin: true,
      },
    });

    res.status(200).json(employee);
  } catch (error) {
    console.error(
      "Error updating employee:",
      error
    );

    res.status(500).json({
      message: "Failed to update employee",
    });
  }
};

export const toggleEmployeeStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const employeeId = Number(req.params.id);

    const existingEmployee =
      await prisma.employee.findUnique({
        where: {
          id: employeeId,
        },
      });

    if (!existingEmployee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const employee =
      await prisma.employee.update({
        where: {
          id: employeeId,
        },
        data: {
          isActive: !existingEmployee.isActive,
        },
        include: {
          role: true,
          userLogin: true,
        },
      });

    res.status(200).json(employee);
  } catch (error) {
    console.error(
      "Error changing employee status:",
      error
    );

    res.status(500).json({
      message: "Failed to change employee status",
    });
  }
};

export default {
  getEmployees,
  createEmployee,
  updateEmployee,
  toggleEmployeeStatus,
};
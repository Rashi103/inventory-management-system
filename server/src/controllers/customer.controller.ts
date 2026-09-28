import { Request, Response } from "express";
import prisma from "../../lib/prisma";

// GET all customers
export const getCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        salesBills: {
          select: {
            id: true,
            grandTotal: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);

    res.status(500).json({
      message: "Failed to fetch customers",
    });
  }
};

// CREATE customer
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Customer name is required",
      });
    }

    const customer = await prisma.customer.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
      },
      include: {
        salesBills: {
          select: {
            id: true,
            grandTotal: true,
          },
        },
      },
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);

    res.status(500).json({
      message: "Failed to create customer",
    });
  }
};

export default {
  getCustomers,
  createCustomer,
};
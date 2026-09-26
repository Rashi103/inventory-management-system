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

export default {
  getCustomers,
};
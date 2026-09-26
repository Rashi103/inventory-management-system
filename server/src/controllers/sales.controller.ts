import { Request, Response } from "express";
import prisma from "../../lib/prisma";

export const getTotalSales = async (_req: Request, res: Response) => {
  try {
    const result = await prisma.salesBill.aggregate({
      _sum: {
        grandTotal: true,
      },
    });

    res.json({
      totalSales: result._sum.grandTotal ?? 0,
    });
  } catch (error) {
    console.error("Error calculating total sales:", error);

    res.status(500).json({
      message: "Failed to calculate total sales",
    });
  }
};

export const createSale = async (req: Request, res: Response) => {
  try {
    const {
      customerId,
      employeeId,
      subtotal,
      taxAmount,
      discount,
      grandTotal,
    } = req.body;

    const sale = await prisma.salesBill.create({
      data: {
        customerId,
        employeeId,
        subtotal,
        taxAmount,
        discount,
        grandTotal,
      },
    });
    res.status(201).json(sale);
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Failed to create sale" });
  }
};
export const getSales = async (_req: Request, res: Response) => {
  try {
    const sales = await prisma.salesBill.findMany({
      include: {
        customer: true,
        details: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        billDate: "desc",
      },
    });

    res.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({
      message: "Failed to fetch sales",
    });
  }
};
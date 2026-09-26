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

    res.status(500).json({
      message: "Failed to create sale",
    });
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

        payments: true,
      },

      orderBy: {
        billDate: "desc",
      },
    });

    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);

    res.status(500).json({
      message: "Failed to fetch sales",
    });
  }
};

// GET customer purchase performance
export const getCustomerPerformance = async (
  _req: Request,
  res: Response
) => {
  try {
    const sales = await prisma.salesBill.findMany({
      where: {
        customerId: {
          not: null,
        },
      },
      include: {
        customer: true,
      },
    });

    const customerMap = new Map<
      number,
      {
        customerId: number;
        customerName: string;
        totalBills: number;
        totalPurchases: number;
      }
    >();

    sales.forEach((sale) => {
      if (!sale.customer) return;

      const customerId = sale.customer.id;
      const purchaseAmount = Number(sale.grandTotal);

      const existing = customerMap.get(customerId);

      if (existing) {
        existing.totalBills += 1;
        existing.totalPurchases += purchaseAmount;
      } else {
        customerMap.set(customerId, {
          customerId,
          customerName: sale.customer.name,
          totalBills: 1,
          totalPurchases: purchaseAmount,
        });
      }
    });

    const customerPerformance = Array.from(
      customerMap.values()
    ).sort(
      (a, b) => b.totalPurchases - a.totalPurchases
    );

    res.status(200).json(customerPerformance);
  } catch (error) {
    console.error(
      "Error fetching customer performance:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch customer performance",
    });
  }
};

export default {
  getTotalSales,
  createSale,
  getSales,
  getCustomerPerformance,
};
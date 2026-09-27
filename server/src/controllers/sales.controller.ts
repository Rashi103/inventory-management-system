
import { Response } from "express";
import prisma from "../../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// ======================================================
// GET TOTAL SALES
// ======================================================

export const getTotalSales = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const result = await prisma.salesBill.aggregate({
      _sum: {
        grandTotal: true,
      },
    });

    return res.status(200).json({
      totalSales: result._sum.grandTotal ?? 0,
    });
  } catch (error) {
    console.error("Error calculating total sales:", error);

    return res.status(500).json({
      message: "Failed to calculate total sales",
    });
  }
};

// ======================================================
// CREATE SALE
// ======================================================

export const createSale = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const {
      customerId,
      taxAmount = 0,
      discount = 0,
    } = req.body;

    const employeeId = req.user.employeeId;

    // --------------------------------------------------
    // VALIDATE CUSTOMER
    // --------------------------------------------------

    if (customerId !== undefined && customerId !== null) {
      const customer = await prisma.customer.findUnique({
        where: {
          id: Number(customerId),
        },
      });

      if (!customer) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }

      if (!customer.isActive) {
        return res.status(400).json({
          message: "Customer is inactive",
        });
      }
    }

    // --------------------------------------------------
    // VALIDATE TAX AND DISCOUNT
    // --------------------------------------------------

    const tax = Number(taxAmount);
    const discountAmount = Number(discount);

    if (!Number.isFinite(tax) || tax < 0) {
      return res.status(400).json({
        message: "Tax amount must be a valid non-negative number",
      });
    }

    if (!Number.isFinite(discountAmount) || discountAmount < 0) {
      return res.status(400).json({
        message: "Discount must be a valid non-negative number",
      });
    }

    // --------------------------------------------------
    // CREATE SALES BILL
    // --------------------------------------------------

    const sale = await prisma.salesBill.create({
      data: {
        customerId:
          customerId !== undefined && customerId !== null
            ? Number(customerId)
            : null,

        employeeId,

        subtotal: 0,
        taxAmount: tax,
        discount: discountAmount,
        grandTotal: 0,
        status: "PENDING",
      },

      include: {
        customer: true,
        employee: true,
        details: true,
        payments: true,
      },
    });

    return res.status(201).json({
      message: "Sales bill created successfully",
      sale,
    });
  } catch (error) {
    console.error("Error creating sale:", error);

    return res.status(500).json({
      message: "Failed to create sale",
    });
  }
};

// ======================================================
// GET ALL SALES
// ======================================================

export const getSales = async (
  _req: AuthRequest,
  res: Response
) => {
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

    return res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);

    return res.status(500).json({
      message: "Failed to fetch sales",
    });
  }
};

// ======================================================
// GET CUSTOMER PURCHASE PERFORMANCE
// ======================================================

export const getCustomerPerformance = async (
  _req: AuthRequest,
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

    return res.status(200).json(customerPerformance);
  } catch (error) {
    console.error(
      "Error fetching customer performance:",
      error
    );

    return res.status(500).json({
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


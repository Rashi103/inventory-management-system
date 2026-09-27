
import { Response } from "express";
import prisma from "../../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// ======================================================
// ADD PRODUCT TO SALES BILL
// ======================================================

export const createSalesDetail = async (
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
      salesBillId,
      productId,
      quantity,
      unitPrice,
      discount = 0,
    } = req.body;

    // --------------------------------------------------
    // VALIDATE INPUT
    // --------------------------------------------------

    if (!salesBillId || !productId || !quantity || unitPrice === undefined) {
      return res.status(400).json({
        message:
          "salesBillId, productId, quantity and unitPrice are required",
      });
    }

    const saleQuantity = Number(quantity);
    const price = Number(unitPrice);
    const discountAmount = Number(discount);

    if (!Number.isInteger(saleQuantity) || saleQuantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be a positive whole number",
      });
    }

    if (!Number.isFinite(price) || price < 0) {
      return res.status(400).json({
        message: "Unit price must be a valid non-negative number",
      });
    }

    if (!Number.isFinite(discountAmount) || discountAmount < 0) {
      return res.status(400).json({
        message: "Discount must be a valid non-negative number",
      });
    }

    // --------------------------------------------------
    // CHECK SALES BILL
    // --------------------------------------------------

    const salesBill = await prisma.salesBill.findUnique({
      where: {
        id: Number(salesBillId),
      },
    });

    if (!salesBill) {
      return res.status(404).json({
        message: "Sales bill not found",
      });
    }

    // --------------------------------------------------
    // CHECK PRODUCT
    // --------------------------------------------------

    const product = await prisma.product.findUnique({
      where: {
        id: Number(productId),
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        message: "Product is inactive",
      });
    }

    // --------------------------------------------------
    // CHECK INVENTORY
    // --------------------------------------------------

    const inventory = await prisma.inventory.findFirst({
      where: {
        productId: Number(productId),
        quantity: {
          gte: saleQuantity,
        },
      },
      orderBy: [
        {
          expiryDate: "asc",
        },
        {
          id: "asc",
        },
      ],
    });

    if (!inventory) {
      return res.status(400).json({
        message: "Insufficient stock for this product",
      });
    }

    // --------------------------------------------------
    // CALCULATE TOTAL
    // --------------------------------------------------

    const totalPrice =
      saleQuantity * price - discountAmount;

    if (totalPrice < 0) {
      return res.status(400).json({
        message: "Discount cannot be greater than item value",
      });
    }

    // --------------------------------------------------
    // CREATE DETAIL + REDUCE INVENTORY
    // --------------------------------------------------

    const result = await prisma.$transaction(async (tx) => {
      const detail = await tx.salesBillDetail.create({
        data: {
          salesBillId: Number(salesBillId),
          productId: Number(productId),
          quantity: saleQuantity,
          unitPrice: price,
          discount: discountAmount,
          totalPrice,
        },
        include: {
          product: true,
        },
      });

      await tx.inventory.update({
        where: {
          id: inventory.id,
        },
        data: {
          quantity: {
            decrement: saleQuantity,
          },
        },
      });

      await tx.stockTransaction.create({
        data: {
          productId: Number(productId),
          warehouseId: inventory.warehouseId,
          employeeId: req.user!.employeeId,
          transactionType: "SALE",
          quantity: saleQuantity,
          referenceType: "SALES_BILL",
          referenceId: Number(salesBillId),
          remarks: "Stock issued against sales bill",
        },
      });

      return detail;
    });

    return res.status(201).json({
      message: "Product added to sales bill successfully",
      detail: result,
    });
  } catch (error) {
    console.error(
      "Error creating sales detail:",
      error
    );

    return res.status(500).json({
      message: "Failed to add product to sales bill",
    });
  }
};

// ======================================================
// GET SALES PERFORMANCE
// ======================================================

export const getSalesPerformance = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const details = await prisma.salesBillDetail.findMany({
      include: {
        product: true,
        salesBill: true,
      },
    });

    const productMap = new Map<
      number,
      {
        productId: number;
        productName: string;
        quantitySold: number;
        totalSales: number;
      }
    >();

    details.forEach((detail) => {
      const existing = productMap.get(detail.productId);

      if (existing) {
        existing.quantitySold += detail.quantity;
        existing.totalSales += Number(detail.totalPrice);
      } else {
        productMap.set(detail.productId, {
          productId: detail.productId,
          productName: detail.product.name,
          quantitySold: detail.quantity,
          totalSales: Number(detail.totalPrice),
        });
      }
    });

    const performance = Array.from(
      productMap.values()
    ).sort(
      (a, b) => b.quantitySold - a.quantitySold
    );

    return res.status(200).json(performance);
  } catch (error) {
    console.error(
      "Error fetching sales performance:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch sales performance",
    });
  }
};

export default {
  createSalesDetail,
  getSalesPerformance,
};

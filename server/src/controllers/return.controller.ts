
import { Response } from "express";
import prisma from "../../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const createSalesReturn = async (
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
      batchNumber,
      quantity,
      reason,
      refundAmount = 0,
    } = req.body;

    if (
      !salesBillId ||
      !productId ||
      !batchNumber ||
      !quantity
    ) {
      return res.status(400).json({
        message:
          "salesBillId, productId, batchNumber and quantity are required",
      });
    }

    const returnQuantity = Number(quantity);
    const refund = Number(refundAmount);

    if (!Number.isInteger(returnQuantity) || returnQuantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be a positive whole number",
      });
    }

    if (!Number.isFinite(refund) || refund < 0) {
      return res.status(400).json({
        message: "Refund amount must be a valid non-negative number",
      });
    }

    const salesBill = await prisma.salesBill.findUnique({
      where: {
        id: Number(salesBillId),
      },
      include: {
        details: true,
      },
    });

    if (!salesBill) {
      return res.status(404).json({
        message: "Sales bill not found",
      });
    }

    const salesDetail = salesBill.details.find(
      (detail) => detail.productId === Number(productId)
    );

    if (!salesDetail) {
      return res.status(400).json({
        message:
          "This product does not belong to the selected sales bill",
      });
    }

    if (returnQuantity > salesDetail.quantity) {
      return res.status(400).json({
        message: "Return quantity cannot exceed sold quantity",
      });
    }

    const inventory = await prisma.inventory.findUnique({
      where: {
        productId_warehouseId_batchNumber: {
          productId: Number(productId),
          warehouseId: 1,
          batchNumber,
        },
      },
    });

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory batch not found",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const salesReturn = await tx.salesReturn.create({
        data: {
          salesBillId: Number(salesBillId),
          productId: Number(productId),
          employeeId: req.user!.employeeId,
          batchNumber,
          quantity: returnQuantity,
          reason: reason || null,
          refundAmount: refund,
        },
      });

      const updatedInventory = await tx.inventory.update({
        where: {
          id: inventory.id,
        },
        data: {
          quantity: {
            increment: returnQuantity,
          },
        },
      });

      const stockTransaction =
        await tx.stockTransaction.create({
          data: {
            productId: Number(productId),
            warehouseId: inventory.warehouseId,
            employeeId: req.user!.employeeId,
            transactionType: "SALES_RETURN",
            quantity: returnQuantity,
            referenceType: "SALES_RETURN",
            referenceId: salesReturn.id,
            remarks: reason || "Product returned by customer",
          },
        });

      return {
        salesReturn,
        updatedInventory,
        stockTransaction,
      };
    });

    return res.status(201).json({
      message: "Sales return recorded successfully",
      ...result,
    });
  } catch (error) {
    console.error("Error creating sales return:", error);

    return res.status(500).json({
      message: "Failed to create sales return",
    });
  }
};

export const getSalesReturns = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const returns = await prisma.salesReturn.findMany({
      include: {
        salesBill: true,
        product: true,
        employee: true,
      },
      orderBy: {
        returnDate: "desc",
      },
    });

    return res.status(200).json(returns);
  } catch (error) {
    console.error("Error fetching sales returns:", error);

    return res.status(500).json({
      message: "Failed to fetch sales returns",
    });
  }
};



export default {
  createSalesReturn,
};


import { Response } from "express";
import prisma from "../../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// ======================================================
// GET ALL PURCHASE ORDERS
// ======================================================

export const getPurchaseOrders = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const purchaseOrders =
      await prisma.purchaseOrder.findMany({
        include: {
          supplier: true,
          employee: true,
          details: {
            include: {
              product: true,
            },
          },
          goodsReceipts: true,
        },
        orderBy: {
          id: "asc",
        },
      });

    return res.status(200).json(purchaseOrders);
  } catch (error) {
    console.error(
      "Error fetching purchase orders:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch purchase orders",
    });
  }
};

// ======================================================
// CREATE PURCHASE ORDER
// ======================================================

export const createPurchaseOrder = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { supplierId, remarks, items } = req.body;

    // --------------------------------------------------
    // VALIDATE LOGIN
    // --------------------------------------------------

    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // employeeId comes from the JWT
    const employeeId = req.user.employeeId;

    // --------------------------------------------------
    // VALIDATE BASIC INPUT
    // --------------------------------------------------

    if (!supplierId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message:
          "supplierId and at least one purchase item are required",
      });
    }

    // --------------------------------------------------
    // VALIDATE SUPPLIER
    // --------------------------------------------------

    const supplier = await prisma.supplier.findUnique({
      where: {
        id: Number(supplierId),
      },
    });

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    // --------------------------------------------------
    // VALIDATE EMPLOYEE
    // --------------------------------------------------

    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
    });

    if (!employee || !employee.isActive) {
      return res.status(400).json({
        message: "Logged-in employee is invalid or inactive",
      });
    }

    // --------------------------------------------------
    // VALIDATE PRODUCTS
    // --------------------------------------------------

    const productIds = items.map((item: any) =>
      Number(item.productId)
    );

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        message: "One or more products were not found",
      });
    }

    // --------------------------------------------------
    // PREPARE PURCHASE DETAILS
    // --------------------------------------------------

    const purchaseDetails = items.map((item: any) => {
      const quantity = Number(item.quantity);
      const unitCost = Number(item.unitCost);

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        throw new Error(
          "Quantity must be a positive whole number"
        );
      }

      if (!Number.isFinite(unitCost) || unitCost < 0) {
        throw new Error(
          "Unit cost must be a valid non-negative number"
        );
      }

      const totalCost = quantity * unitCost;

      return {
        productId: Number(item.productId),
        quantity,
        unitCost,
        totalCost,
      };
    });

    // --------------------------------------------------
    // CALCULATE TOTAL PURCHASE AMOUNT
    // --------------------------------------------------

    const totalAmount = purchaseDetails.reduce(
      (total, detail) =>
        total + detail.totalCost,
      0
    );

    // --------------------------------------------------
    // CREATE PURCHASE ORDER + DETAILS
    // --------------------------------------------------

    const purchaseOrder =
      await prisma.$transaction(async (tx) => {
        const order =
          await tx.purchaseOrder.create({
            data: {
              supplierId: Number(supplierId),
              employeeId,
              status: "PENDING",
              totalAmount,
              remarks: remarks || null,

              details: {
                create: purchaseDetails,
              },
            },

            include: {
              supplier: true,
              employee: true,
              details: {
                include: {
                  product: true,
                },
              },
            },
          });

        return order;
      });

    return res.status(201).json({
      message: "Purchase order created successfully",
      purchaseOrder,
    });
  } catch (error) {
    console.error(
      "Error creating purchase order:",
      error
    );

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to create purchase order",
    });
  }
};


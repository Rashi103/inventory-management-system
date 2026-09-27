
import { Response } from "express";
import prisma from "../../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// ======================================================
// CREATE GOODS RECEIPT
// ======================================================

export const createGoodsReceipt = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const employeeId = req.user.employeeId;

    const {
      purchaseOrderId,
      productId,
      warehouseId,
      batchNumber,
      quantityReceived,
      manufacturingDate,
      expiryDate,
      remarks,
    } = req.body;

    // --------------------------------------------------
    // VALIDATE REQUIRED INPUT
    // --------------------------------------------------

    if (
      !purchaseOrderId ||
      !productId ||
      !warehouseId ||
      !batchNumber ||
      !quantityReceived
    ) {
      return res.status(400).json({
        message:
          "purchaseOrderId, productId, warehouseId, batchNumber and quantityReceived are required",
      });
    }

    const quantity = Number(quantityReceived);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        message: "quantityReceived must be a positive whole number",
      });
    }

    // --------------------------------------------------
    // CHECK PURCHASE ORDER
    // --------------------------------------------------

    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: {
        id: Number(purchaseOrderId),
      },
      include: {
        details: true,
      },
    });

    if (!purchaseOrder) {
      return res.status(404).json({
        message: "Purchase order not found",
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

    // --------------------------------------------------
    // CHECK WAREHOUSE
    // --------------------------------------------------

    const warehouse = await prisma.warehouse.findUnique({
      where: {
        id: Number(warehouseId),
      },
    });

    if (!warehouse) {
      return res.status(404).json({
        message: "Warehouse not found",
      });
    }

    if (!warehouse.isActive) {
      return res.status(400).json({
        message: "Warehouse is inactive",
      });
    }

    // --------------------------------------------------
    // CHECK PURCHASE ORDER DETAIL
    // --------------------------------------------------

    const purchaseDetail = purchaseOrder.details.find(
      (detail) => detail.productId === Number(productId)
    );

    if (!purchaseDetail) {
      return res.status(400).json({
        message:
          "This product does not belong to the selected purchase order",
      });
    }

    // --------------------------------------------------
    // CHECK RECEIVED QUANTITY
    // --------------------------------------------------

    const previousReceipts =
      await prisma.goodsReceipt.aggregate({
        where: {
          purchaseOrderId: Number(purchaseOrderId),
          productId: Number(productId),
        },
        _sum: {
          quantityReceived: true,
        },
      });

    const alreadyReceived =
      previousReceipts._sum.quantityReceived || 0;

    const orderedQuantity = purchaseDetail.quantity;

    if (alreadyReceived + quantity > orderedQuantity) {
      return res.status(400).json({
        message: `Cannot receive ${quantity} units. Only ${
          orderedQuantity - alreadyReceived
        } units remain.`,
      });
    }

    // --------------------------------------------------
    // VALIDATE DATES
    // --------------------------------------------------

    let manufacturingDateValue: Date | null = null;
    let expiryDateValue: Date | null = null;

    if (manufacturingDate) {
      manufacturingDateValue = new Date(manufacturingDate);

      if (isNaN(manufacturingDateValue.getTime())) {
        return res.status(400).json({
          message: "Invalid manufacturing date",
        });
      }
    }

    if (expiryDate) {
      expiryDateValue = new Date(expiryDate);

      if (isNaN(expiryDateValue.getTime())) {
        return res.status(400).json({
          message: "Invalid expiry date",
        });
      }
    }

    // --------------------------------------------------
    // CREATE RECEIPT + UPDATE INVENTORY + STOCK TRANSACTION
    // --------------------------------------------------

    const result = await prisma.$transaction(async (tx) => {
      // Create goods receipt
      const goodsReceipt = await tx.goodsReceipt.create({
        data: {
          purchaseOrderId: Number(purchaseOrderId),
          productId: Number(productId),
          warehouseId: Number(warehouseId),
          employeeId,
          batchNumber,
          quantityReceived: quantity,
          manufacturingDate: manufacturingDateValue,
          expiryDate: expiryDateValue,
          remarks: remarks || null,
        },
      });

      // Check whether this product/batch already exists
      const existingInventory =
        await tx.inventory.findUnique({
          where: {
            productId_warehouseId_batchNumber: {
              productId: Number(productId),
              warehouseId: Number(warehouseId),
              batchNumber,
            },
          },
        });

      let inventory;

      if (existingInventory) {
        // Add received quantity to existing batch
        inventory = await tx.inventory.update({
          where: {
            id: existingInventory.id,
          },
          data: {
            quantity: {
              increment: quantity,
            },
            manufacturingDate:
              manufacturingDateValue ||
              existingInventory.manufacturingDate,
            expiryDate:
              expiryDateValue ||
              existingInventory.expiryDate,
          },
        });
      } else {
        // Create new inventory batch
        inventory = await tx.inventory.create({
          data: {
            productId: Number(productId),
            warehouseId: Number(warehouseId),
            batchNumber,
            quantity,
            manufacturingDate: manufacturingDateValue,
            expiryDate: expiryDateValue,
          },
        });
      }

      // Create stock transaction
      const stockTransaction =
        await tx.stockTransaction.create({
          data: {
            productId: Number(productId),
            warehouseId: Number(warehouseId),
            employeeId,
            transactionType: "PURCHASE_RECEIPT",
            quantity,
            referenceType: "GOODS_RECEIPT",
            referenceId: goodsReceipt.id,
            remarks:
              remarks || "Stock received against purchase order",
          },
        });

      // Check whether the complete PO has been received
      const allDetails =
        await tx.purchaseOrderDetail.findMany({
          where: {
            purchaseOrderId: Number(purchaseOrderId),
          },
        });

      const allReceipts =
        await tx.goodsReceipt.findMany({
          where: {
            purchaseOrderId: Number(purchaseOrderId),
          },
        });

      const complete = allDetails.every((detail) => {
        const received = allReceipts
          .filter(
            (receipt) =>
              receipt.productId === detail.productId
          )
          .reduce(
            (sum, receipt) =>
              sum + receipt.quantityReceived,
            0
          );

        return received >= detail.quantity;
      });

      await tx.purchaseOrder.update({
        where: {
          id: Number(purchaseOrderId),
        },
        data: {
          status: complete ? "RECEIVED" : "PARTIALLY_RECEIVED",
        },
      });

      return {
        goodsReceipt,
        inventory,
        stockTransaction,
      };
    });

    return res.status(201).json({
      message: "Goods received successfully",
      ...result,
    });
  } catch (error) {
    console.error(
      "Error creating goods receipt:",
      error
    );

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to create goods receipt",
    });
  }
};

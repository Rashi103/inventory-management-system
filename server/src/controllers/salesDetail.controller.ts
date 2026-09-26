import { Request, Response } from "express";
import prisma from "../../lib/prisma";

export const createSalesDetail = async (req: Request, res: Response) => {
  try {
    const {
      salesBillId,
      productId,
      quantity,
      unitPrice,
      discount,
      totalPrice,
    } = req.body;

    const salesDetail = await prisma.salesBillDetail.create({
      data: {
        salesBillId,
        productId,
        quantity,
        unitPrice,
        discount,
        totalPrice,
      },
    });

    res.status(201).json(salesDetail);
  } catch (error) {
    console.error("Error creating sales detail:", error);

    res.status(500).json({
      message: "Failed to create sales detail",
    });
  }
};

// GET product performance report
export const getProductPerformance = async (
  _req: Request,
  res: Response
) => {
  try {
    const salesDetails = await prisma.salesBillDetail.findMany({
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
        sku: string;
        quantitySold: number;
        revenue: number;
      }
    >();

    salesDetails.forEach((detail) => {
      const productId = detail.productId;

      const existing = productMap.get(productId);

      const quantitySold = Number(detail.quantity);
      const revenue = Number(detail.totalPrice);

      if (existing) {
        existing.quantitySold += quantitySold;
        existing.revenue += revenue;
      } else {
        productMap.set(productId, {
          productId: productId,
          productName: detail.product.name,
          sku: detail.product.sku,
          quantitySold: quantitySold,
          revenue: revenue,
        });
      }
    });

    const productPerformance = Array.from(productMap.values()).sort(
      (a, b) => b.quantitySold - a.quantitySold
    );

    res.status(200).json(productPerformance);
  } catch (error) {
    console.error("Error fetching product performance:", error);

    res.status(500).json({
      message: "Failed to fetch product performance",
    });
  }
};

export default {
  createSalesDetail,
  getProductPerformance,
};
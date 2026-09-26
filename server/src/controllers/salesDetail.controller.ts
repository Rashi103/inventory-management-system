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
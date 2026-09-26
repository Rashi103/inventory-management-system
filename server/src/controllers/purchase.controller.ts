
import { Request, Response } from "express";
import prisma from "../../lib/prisma";

// Get all purchase orders
export const getPurchaseOrders = async (
  _req: Request,
  res: Response
) => {
  try {
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      include: {
        supplier: true,
        employee: true,
        details: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json(purchaseOrders);
  } catch (error) {
    console.error("Error fetching purchase orders:", error);

    res.status(500).json({
      message: "Failed to fetch purchase orders",
    });
  }
};


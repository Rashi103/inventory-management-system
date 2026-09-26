import { Request, Response } from "express";
import prisma from "../../lib/prisma";

export const getReturns = async (_req: Request, res: Response) => {
  try {
    const [salesReturns, purchaseReturns] = await Promise.all([
      prisma.salesReturn.findMany({
        include: {
          salesBill: {
            include: {
              customer: true,
            },
          },
          product: true,
        },
        orderBy: {
          returnDate: "desc",
        },
      }),

      prisma.purchaseReturn.findMany({
        include: {
          supplier: true,
          product: true,
        },
        orderBy: {
          returnDate: "desc",
        },
      }),
    ]);

    const formattedSalesReturns = salesReturns.map((item) => ({
      id: item.id,
      returnNumber: `SR-2026-${String(item.id).padStart(3, "0")}`,
      type: "Sales Return",
      referenceNumber: `INV-2026-${String(item.salesBillId).padStart(
        3,
        "0"
      )}`,
      party: item.salesBill.customer?.name ?? "Walk-in Customer",
      returnDate: item.returnDate,
      items: item.quantity,
      amount: Number(item.refundAmount ?? 0),
      status: "Completed",
    }));

    const formattedPurchaseReturns = purchaseReturns.map((item) => ({
      id: 10000 + item.id,
      returnNumber: `PR-2026-${String(item.id).padStart(3, "0")}`,
      type: "Purchase Return",
      referenceNumber: `PO-2026-${String(item.id).padStart(3, "0")}`,
      party: item.supplier.name,
      returnDate: item.returnDate,
      items: item.quantity,
      amount: Number(item.totalAmount ?? 0),
      status: "Completed",
    }));

    const returns = [
      ...formattedSalesReturns,
      ...formattedPurchaseReturns,
    ].sort(
      (a, b) =>
        new Date(b.returnDate).getTime() -
        new Date(a.returnDate).getTime()
    );

    res.status(200).json(returns);
  } catch (error) {
    console.error("Error fetching returns:", error);

    res.status(500).json({
      message: "Failed to fetch returns",
    });
  }
};

export default {
  getReturns,
};
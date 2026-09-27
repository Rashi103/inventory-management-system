
import { Response } from "express";
import prisma from "../../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const createPayment = async (
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
      amount,
      paymentMethod,
      transactionReference,
    } = req.body;

    if (!salesBillId || amount === undefined || !paymentMethod) {
      return res.status(400).json({
        message:
          "salesBillId, amount and paymentMethod are required",
      });
    }

    const paymentAmount = Number(amount);

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({
        message: "Amount must be a positive number",
      });
    }

    const validMethods = ["CASH", "UPI", "CARD"];

    if (!validMethods.includes(paymentMethod)) {
      return res.status(400).json({
        message: "Payment method must be CASH, UPI or CARD",
      });
    }

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

    if (paymentAmount > Number(salesBill.grandTotal)) {
      return res.status(400).json({
        message: "Payment amount cannot exceed bill total",
      });
    }

    const payment = await prisma.payment.create({
      data: {
        salesBillId: Number(salesBillId),
        amount: paymentAmount,
        paymentMethod,
        transactionReference:
          transactionReference || null,
        status: "COMPLETED",
      },
    });

    await prisma.salesBill.update({
      where: {
        id: Number(salesBillId),
      },
      data: {
        status: "COMPLETED",
      },
    });

    return res.status(201).json({
      message: "Payment recorded successfully",
      payment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);

    return res.status(500).json({
      message: "Failed to record payment",
    });
  }
};

export default {
  createPayment,
};


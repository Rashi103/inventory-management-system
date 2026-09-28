import { Response } from "express";
import prisma from "../../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

// Product stock summary
export const getStockSummary = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT * FROM product_stock_summary
    `;

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching stock summary:", error);

    return res.status(500).json({
      message: "Failed to fetch stock summary",
    });
  }
};

// Low stock products
export const getLowStockProducts = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT * FROM low_stock_products
    `;

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching low stock products:", error);

    return res.status(500).json({
      message: "Failed to fetch low stock products",
    });
  }
};

// Expired inventory
export const getExpiredInventory = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT * FROM expired_inventory
    `;

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching expired inventory:", error);

    return res.status(500).json({
      message: "Failed to fetch expired inventory",
    });
  }
};

// Sales summary
export const getSalesSummary = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT * FROM sales_summary
    `;

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching sales summary:", error);

    return res.status(500).json({
      message: "Failed to fetch sales summary",
    });
  }
};

// Daily / Weekly / Monthly / Yearly sales report
export const getSalesPeriodReport = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const period = String(req.query.period || "monthly");

    if (!["daily", "weekly", "monthly", "yearly"].includes(period)) {
      return res.status(400).json({
        message:
          "Invalid period. Use daily, weekly, monthly or yearly.",
      });
    }

    let groupExpression: string;

    if (period === "daily") {
      groupExpression = `DATE("billDate")`;
    } else if (period === "weekly") {
      groupExpression = `DATE_TRUNC('week', "billDate")`;
    } else if (period === "monthly") {
      groupExpression = `DATE_TRUNC('month', "billDate")`;
    } else {
      groupExpression = `DATE_TRUNC('year', "billDate")`;
    }

    const result = await prisma.$queryRawUnsafe(
      `
      SELECT
        ${groupExpression} AS period,
        COUNT(*)::int AS bills,
        COALESCE(SUM("grandTotal"), 0) AS revenue
      FROM "SalesBill"
      WHERE status = 'COMPLETED'
      GROUP BY ${groupExpression}
      ORDER BY ${groupExpression} ASC
      `
    );

    return res.status(200).json({
      period,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching sales period report:", error);

    return res.status(500).json({
      message: "Failed to fetch sales period report",
    });
  }
};

// Product sales performance
export const getProductSalesSummary = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT * FROM product_sales_summary
    `;

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Error fetching product sales summary:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch product sales summary",
    });
  }
};

// Customer purchase summary
export const getCustomerPurchaseSummary = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT * FROM customer_purchase_summary
    `;

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Error fetching customer purchase summary:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch customer purchase summary",
    });
  }
};

export default {
  getStockSummary,
  getLowStockProducts,
  getExpiredInventory,
  getSalesSummary,
  getProductSalesSummary,
  getCustomerPurchaseSummary,
  getSalesPeriodReport,
};
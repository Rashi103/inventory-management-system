
import { Request, Response } from "express";
import prisma from "../../lib/prisma";

// Get all inventory
export const getInventory = async (
  _req: Request,
  res: Response
) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);

    res.status(500).json({
      message: "Failed to fetch inventory",
    });
  }
};

// Get low-stock products
export const getLowStockProducts = async (
  _req: Request,
  res: Response
) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        product: true,
      },
    });

    const reorderLevels = await prisma.reorderLevel.findMany();

    const lowStockProducts = inventory.filter((item) => {
      const reorderLevel = reorderLevels.find(
        (level) => level.productId === item.productId
      );

      return (
        reorderLevel &&
        item.quantity <= reorderLevel.reorderPoint
      );
    });

    res.json({
      count: lowStockProducts.length,
      products: lowStockProducts,
    });
  } catch (error) {
    console.error("Error fetching low stock products:", error);

    res.status(500).json({
      message: "Failed to fetch low stock products",
    });
  }
};

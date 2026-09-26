
import { Request, Response } from "express";
import prisma from "../../lib/prisma";

// GET all warehouses
export const getWarehouses = async (
  _req: Request,
  res: Response
) => {
  try {
    const warehouses = await prisma.warehouse.findMany({
      include: {
        inventories: {
          select: {
            id: true,
          },
        },
        stockTransactions: {
          select: {
            id: true,
          },
        },
        goodsReceipts: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json(warehouses);
  } catch (error) {
    console.error("Error fetching warehouses:", error);

    res.status(500).json({
      message: "Failed to fetch warehouses",
    });
  }
};

// CREATE a warehouse
export const createWarehouse = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      location,
      managerName,
    } = req.body;

    const warehouse = await prisma.warehouse.create({
      data: {
        name,
        location,
        managerName,
      },
    });

    res.status(201).json(warehouse);
  } catch (error) {
    console.error("Error creating warehouse:", error);

    res.status(500).json({
      message: "Failed to create warehouse",
    });
  }
};

export default {
  getWarehouses,
  createWarehouse,
};


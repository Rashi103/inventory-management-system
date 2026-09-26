
import { Request, Response } from "express";
import prisma from "../../lib/prisma";

// GET all suppliers
export const getSuppliers = async (
  _req: Request,
  res: Response
) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        purchaseOrders: {
          select: {
            id: true,
          },
        },
        purchaseReturns: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);

    res.status(500).json({
      message: "Failed to fetch suppliers",
    });
  }
};

// CREATE a supplier
export const createSupplier = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      gstNumber,
    } = req.body;

    const supplier = await prisma.supplier.create({
      data: {
        name,
        email,
        phone,
        address,
        gstNumber,
      },
    });

    res.status(201).json(supplier);
  } catch (error) {
    console.error("Error creating supplier:", error);

    res.status(500).json({
      message: "Failed to create supplier",
    });
  }
};



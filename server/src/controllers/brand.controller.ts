
import { Request, Response } from "express";
import prisma from "../../lib/prisma";

// GET all brands
export const getBrands = async (
  _req: Request,
  res: Response
) => {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        products: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);

    res.status(500).json({
      message: "Failed to fetch brands",
    });
  }
};

// CREATE a brand
export const createBrand = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, description } = req.body;

    const brand = await prisma.brand.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json(brand);
  } catch (error) {
    console.error("Error creating brand:", error);

    res.status(500).json({
      message: "Failed to create brand",
    });
  }
};


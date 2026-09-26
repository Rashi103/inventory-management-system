
import { Request, Response } from "express";
import prisma from "../../lib/prisma";

// GET all subcategories
export const getSubCategories = async (
  _req: Request,
  res: Response
) => {
  try {
    const subCategories = await prisma.subCategory.findMany({
      include: {
        category: true,
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

    res.status(200).json(subCategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);

    res.status(500).json({
      message: "Failed to fetch subcategories",
    });
  }
};


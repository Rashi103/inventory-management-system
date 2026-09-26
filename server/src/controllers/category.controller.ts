import { Request, Response } from "express";
import prisma from "../../lib/prisma";

// GET all categories
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
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

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);

    res.status(500).json({
      message: "Failed to fetch categories",
    });
  }
};

// CREATE category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);

    res.status(500).json({
      message: "Failed to create category",
    });
  }
};


import { Request, Response } from "express";
import prisma from "../../lib/prisma";

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
  include: {
    category: true,
    subCategory: true,
    brand: true,
    inventories: true,
  },
});

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      sku,
      description,
      price,
      costPrice,
      unit,
      categoryId,
      subCategoryId,
      brandId,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description,
        price,
        costPrice,
        unit,
        categoryId,
        subCategoryId,
        brandId,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);

    res.status(500).json({
      message: "Failed to create product",
    });
  }
};
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    const {
      name,
      sku,
      description,
      price,
      costPrice,
      unit,
      categoryId,
    } = req.body;

    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        sku,
        description,
        price,
        costPrice,
        unit,
        categoryId,
      },
    });

    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};
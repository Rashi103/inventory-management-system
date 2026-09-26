import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "../lib/prisma";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import customerRoutes from "./routes/customer.routes";
import salesRoutes from "./routes/sales.routes";
import inventoryRoutes from "./routes/inventory.routes";
import salesDetailRoutes from "./routes/salesDetail.routes";
import subCategoryRoutes from "./routes/subCategory.routes";
import brandRoutes from "./routes/brand.routes";
import supplierRoutes from "./routes/supplier.routes";
import warehouseRoutes from "./routes/warehouse.routes";
import purchaseRoutes from "./routes/purchase.routes";

dotenv.config();
console.log("DATABASE_URL loaded:", !!process.env.DATABASE_URL);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/sales-details", salesDetailRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/purchases", purchaseRoutes);


app.get("/", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      message: "Inventory Management System API is running!",
      database: "Connected successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed",
      error: String(error),
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
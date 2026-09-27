import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting database seed...");

  // ============================================================
  // 1. CLEAR EXISTING DATA
  // ============================================================

  console.log("🧹 Clearing existing data...");

  await prisma.payment.deleteMany();
  await prisma.salesReturn.deleteMany();
  await prisma.salesBillDetail.deleteMany();
  await prisma.salesBill.deleteMany();

  await prisma.purchaseReturn.deleteMany();
  await prisma.goodsReceipt.deleteMany();
  await prisma.purchaseOrderDetail.deleteMany();
  await prisma.purchaseOrder.deleteMany();

  await prisma.stockTransaction.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.reorderLevel.deleteMany();

  await prisma.userLogin.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.role.deleteMany();

  await prisma.customer.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.supplier.deleteMany();

  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.category.deleteMany();

  console.log("✅ Existing data cleared.");

  // ============================================================
  // 2. CATEGORIES
  // ============================================================

  console.log("📦 Creating categories...");

  const beverages = await prisma.category.create({
    data: {
      name: "Beverages",
      description: "Tea, coffee and other beverage products",
    },
  });

  const groceries = await prisma.category.create({
    data: {
      name: "Groceries",
      description: "Daily grocery and food products",
    },
  });

  const household = await prisma.category.create({
    data: {
      name: "Household",
      description: "Cleaning and household products",
    },
  });

  const personalCare = await prisma.category.create({
    data: {
      name: "Personal Care",
      description: "Personal hygiene and care products",
    },
  });

  // ============================================================
  // 3. SUBCATEGORIES
  // ============================================================

  console.log("📂 Creating subcategories...");

  const tea = await prisma.subCategory.create({
    data: {
      name: "Tea",
      categoryId: beverages.id,
    },
  });

  const coffee = await prisma.subCategory.create({
    data: {
      name: "Coffee",
      categoryId: beverages.id,
    },
  });

  const flour = await prisma.subCategory.create({
    data: {
      name: "Flour",
      categoryId: groceries.id,
    },
  });

  const rice = await prisma.subCategory.create({
    data: {
      name: "Rice",
      categoryId: groceries.id,
    },
  });

  const detergents = await prisma.subCategory.create({
    data: {
      name: "Detergents",
      categoryId: household.id,
    },
  });

  const cleaners = await prisma.subCategory.create({
    data: {
      name: "Cleaners",
      categoryId: household.id,
    },
  });

  const shampoo = await prisma.subCategory.create({
    data: {
      name: "Shampoo",
      categoryId: personalCare.id,
    },
  });

  const soap = await prisma.subCategory.create({
    data: {
      name: "Soap",
      categoryId: personalCare.id,
    },
  });

  // ============================================================
  // 4. BRANDS
  // ============================================================

  console.log("🏷️ Creating brands...");

  const tata = await prisma.brand.create({
    data: {
      name: "Tata",
      description: "Tata consumer products",
    },
  });

  const aashirvaad = await prisma.brand.create({
    data: {
      name: "Aashirvaad",
      description: "Food and grocery products",
    },
  });

  const nestle = await prisma.brand.create({
    data: {
      name: "Nestle",
      description: "Food and beverage products",
    },
  });

  const surfExcel = await prisma.brand.create({
    data: {
      name: "Surf Excel",
      description: "Laundry and cleaning products",
    },
  });

  const dove = await prisma.brand.create({
    data: {
      name: "Dove",
      description: "Personal care products",
    },
  });

  // ============================================================
  // 5. PRODUCTS
  // ============================================================

  console.log("🛒 Creating products...");

  const tataTea = await prisma.product.create({
    data: {
      name: "Tata Tea",
      sku: "TEA-001",
      description: "Premium tea",
      price: new Prisma.Decimal("250"),
      costPrice: new Prisma.Decimal("200"),
      unit: "packet",
      categoryId: beverages.id,
      subCategoryId: tea.id,
      brandId: tata.id,
      isActive: true,
    },
  });

  const tataCoffee = await prisma.product.create({
    data: {
      name: "Tata Coffee",
      sku: "COF-001",
      description: "Instant coffee powder",
      price: new Prisma.Decimal("320"),
      costPrice: new Prisma.Decimal("260"),
      unit: "packet",
      categoryId: beverages.id,
      subCategoryId: coffee.id,
      brandId: tata.id,
      isActive: true,
    },
  });

  const aashirvaadAtta = await prisma.product.create({
    data: {
      name: "Aashirvaad Atta",
      sku: "ATTA-001",
      description: "Whole wheat flour",
      price: new Prisma.Decimal("450"),
      costPrice: new Prisma.Decimal("380"),
      unit: "bag",
      categoryId: groceries.id,
      subCategoryId: flour.id,
      brandId: aashirvaad.id,
      isActive: true,
    },
  });

  const basmatiRice = await prisma.product.create({
    data: {
      name: "Aashirvaad Basmati Rice",
      sku: "RICE-001",
      description: "Premium basmati rice",
      price: new Prisma.Decimal("650"),
      costPrice: new Prisma.Decimal("550"),
      unit: "bag",
      categoryId: groceries.id,
      subCategoryId: rice.id,
      brandId: aashirvaad.id,
      isActive: true,
    },
  });

  const surf = await prisma.product.create({
    data: {
      name: "Surf Excel",
      sku: "DET-001",
      description: "Laundry detergent",
      price: new Prisma.Decimal("320"),
      costPrice: new Prisma.Decimal("270"),
      unit: "packet",
      categoryId: household.id,
      subCategoryId: detergents.id,
      brandId: surfExcel.id,
      isActive: true,
    },
  });

  const floorCleaner = await prisma.product.create({
    data: {
      name: "Floor Cleaner",
      sku: "CLN-001",
      description: "Multi-purpose floor cleaner",
      price: new Prisma.Decimal("180"),
      costPrice: new Prisma.Decimal("140"),
      unit: "bottle",
      categoryId: household.id,
      subCategoryId: cleaners.id,
      brandId: null,
      isActive: true,
    },
  });

  const doveShampoo = await prisma.product.create({
    data: {
      name: "Dove Shampoo",
      sku: "SHP-001",
      description: "Daily care shampoo",
      price: new Prisma.Decimal("280"),
      costPrice: new Prisma.Decimal("230"),
      unit: "bottle",
      categoryId: personalCare.id,
      subCategoryId: shampoo.id,
      brandId: dove.id,
      isActive: true,
    },
  });

  const doveSoap = await prisma.product.create({
    data: {
      name: "Dove Soap",
      sku: "SOAP-001",
      description: "Moisturizing bathing soap",
      price: new Prisma.Decimal("75"),
      costPrice: new Prisma.Decimal("55"),
      unit: "piece",
      categoryId: personalCare.id,
      subCategoryId: soap.id,
      brandId: dove.id,
      isActive: true,
    },
  });

  // Additional products

  const greenTea = await prisma.product.create({
    data: {
      name: "Tata Green Tea",
      sku: "TEA-002",
      description: "Green tea bags",
      price: new Prisma.Decimal("180"),
      costPrice: new Prisma.Decimal("140"),
      unit: "box",
      categoryId: beverages.id,
      subCategoryId: tea.id,
      brandId: tata.id,
      isActive: true,
    },
  });

  const instantCoffee = await prisma.product.create({
    data: {
      name: "Nestle Classic Coffee",
      sku: "COF-002",
      description: "Classic instant coffee",
      price: new Prisma.Decimal("210"),
      costPrice: new Prisma.Decimal("165"),
      unit: "jar",
      categoryId: beverages.id,
      subCategoryId: coffee.id,
      brandId: nestle.id,
      isActive: true,
    },
  });

  const multigrainAtta = await prisma.product.create({
    data: {
      name: "Aashirvaad Multigrain Atta",
      sku: "ATTA-002",
      description: "Multigrain wheat flour",
      price: new Prisma.Decimal("520"),
      costPrice: new Prisma.Decimal("440"),
      unit: "bag",
      categoryId: groceries.id,
      subCategoryId: flour.id,
      brandId: aashirvaad.id,
      isActive: true,
    },
  });

  const sonaMasooriRice = await prisma.product.create({
    data: {
      name: "Aashirvaad Sona Masoori Rice",
      sku: "RICE-002",
      description: "Premium sona masoori rice",
      price: new Prisma.Decimal("580"),
      costPrice: new Prisma.Decimal("490"),
      unit: "bag",
      categoryId: groceries.id,
      subCategoryId: rice.id,
      brandId: aashirvaad.id,
      isActive: true,
    },
  });

  const detergentLiquid = await prisma.product.create({
    data: {
      name: "Surf Excel Liquid",
      sku: "DET-002",
      description: "Liquid laundry detergent",
      price: new Prisma.Decimal("390"),
      costPrice: new Prisma.Decimal("330"),
      unit: "bottle",
      categoryId: household.id,
      subCategoryId: detergents.id,
      brandId: surfExcel.id,
      isActive: true,
    },
  });

  const dishCleaner = await prisma.product.create({
    data: {
      name: "Dish Wash Cleaner",
      sku: "CLN-002",
      description: "Kitchen dish cleaning liquid",
      price: new Prisma.Decimal("150"),
      costPrice: new Prisma.Decimal("110"),
      unit: "bottle",
      categoryId: household.id,
      subCategoryId: cleaners.id,
      brandId: null,
      isActive: true,
    },
  });

  const doveConditioner = await prisma.product.create({
    data: {
      name: "Dove Conditioner",
      sku: "SHP-002",
      description: "Hair conditioner",
      price: new Prisma.Decimal("310"),
      costPrice: new Prisma.Decimal("250"),
      unit: "bottle",
      categoryId: personalCare.id,
      subCategoryId: shampoo.id,
      brandId: dove.id,
      isActive: true,
    },
  });

  const luxSoap = await prisma.product.create({
    data: {
      name: "Dove Sensitive Soap",
      sku: "SOAP-002",
      description: "Sensitive skin bathing soap",
      price: new Prisma.Decimal("85"),
      costPrice: new Prisma.Decimal("62"),
      unit: "piece",
      categoryId: personalCare.id,
      subCategoryId: soap.id,
      brandId: dove.id,
      isActive: true,
    },
  });

  // ============================================================
  // 6. SUPPLIERS
  // ============================================================

  console.log("🚚 Creating suppliers...");

  const tataSupplier = await prisma.supplier.create({
    data: {
      name: "Tata Consumer Products",
      email: "tata@example.com",
      phone: "9876543210",
      address: "Mumbai, Maharashtra",
      gstNumber: "23ABCDE1234F1Z5",
      isActive: true,
    },
  });

  const abcSupplier = await prisma.supplier.create({
    data: {
      name: "ABC Wholesale",
      email: "abc@example.com",
      phone: "9876501234",
      address: "Indore, Madhya Pradesh",
      gstNumber: "23XYZAB5678C1Z2",
      isActive: true,
    },
  });

  const globalSupplier = await prisma.supplier.create({
    data: {
      name: "Global Distributors",
      email: "global@example.com",
      phone: "9988776655",
      address: "Jabalpur, Madhya Pradesh",
      gstNumber: "23PQRST9012D1Z7",
      isActive: true,
    },
  });

  const localSupplier = await prisma.supplier.create({
    data: {
      name: "Central Grocery Suppliers",
      email: "central@example.com",
      phone: "9123456780",
      address: "Bhopal, Madhya Pradesh",
      gstNumber: "23LMNOP3456E1Z8",
      isActive: true,
    },
  });

  // ============================================================
  // 7. WAREHOUSES
  // ============================================================

  console.log("🏭 Creating warehouses...");

  const mainWarehouse = await prisma.warehouse.create({
    data: {
      name: "Main Warehouse",
      location: "Bhopal",
      managerName: "Rahul Sharma",
      isActive: true,
    },
  });

  const secondaryWarehouse = await prisma.warehouse.create({
    data: {
      name: "Secondary Warehouse",
      location: "Indore",
      managerName: "Amit Verma",
      isActive: true,
    },
  });

  const oldWarehouse = await prisma.warehouse.create({
    data: {
      name: "Old Warehouse",
      location: "Jabalpur",
      managerName: "Priya Singh",
      isActive: false,
    },
  });

  const cityWarehouse = await prisma.warehouse.create({
    data: {
      name: "City Warehouse",
      location: "Bhopal",
      managerName: "Neha Gupta",
      isActive: true,
    },
  });

  // ============================================================
  // 8. ROLES
  // ============================================================

  console.log("👥 Creating roles...");

  const managerRole = await prisma.role.create({
    data: {
      name: "Manager",
      description: "Full inventory and business management access",
    },
  });

  const salesRole = await prisma.role.create({
    data: {
      name: "Sales Executive",
      description: "Handles customers and sales",
    },
  });

  const inventoryRole = await prisma.role.create({
    data: {
      name: "Inventory Staff",
      description: "Handles inventory and stock operations",
    },
  });

  const accountantRole = await prisma.role.create({
    data: {
      name: "Accountant",
      description: "Handles payments and financial records",
    },
  });

  // ============================================================
  // 9. EMPLOYEES
  // ============================================================

  console.log("👨‍💼 Creating employees...");

  const rahul = await prisma.employee.create({
    data: {
      name: "Rahul Sharma",
      email: "rahul@inventory.com",
      phone: "9876543210",
      address: "Bhopal",
      roleId: managerRole.id,
      isActive: true,
    },
  });

  const priya = await prisma.employee.create({
    data: {
      name: "Priya Singh",
      email: "priya@inventory.com",
      phone: "9988776655",
      address: "Indore",
      roleId: salesRole.id,
      isActive: true,
    },
  });

  const amit = await prisma.employee.create({
    data: {
      name: "Amit Verma",
      email: "amit@inventory.com",
      phone: "9876501234",
      address: "Jabalpur",
      roleId: inventoryRole.id,
      isActive: true,
    },
  });

  const neha = await prisma.employee.create({
    data: {
      name: "Neha Gupta",
      email: "neha@inventory.com",
      phone: "9123456789",
      address: "Bhopal",
      roleId: accountantRole.id,
      isActive: false,
    },
  });

  const rohit = await prisma.employee.create({
    data: {
      name: "Rohit Mehta",
      email: "rohit@inventory.com",
      phone: "9012345678",
      address: "Bhopal",
      roleId: inventoryRole.id,
      isActive: true,
    },
  });

  const simran = await prisma.employee.create({
    data: {
      name: "Simran Kapoor",
      email: "simran@inventory.com",
      phone: "9098765432",
      address: "Indore",
      roleId: salesRole.id,
      isActive: true,
    },
  });

  // ============================================================
  // 10. USER LOGINS
  // ============================================================

  const passwordHash = await bcrypt.hash("password123", 10);

  console.log("🔐 Creating user logins...");

  await prisma.userLogin.create({
    data: {
      employeeId: rahul.id,
      username: "rahul",
      passwordHash,
      isActive: true,
    },
  });

  await prisma.userLogin.create({
    data: {
      employeeId: priya.id,
      username: "priya",
      passwordHash,
      isActive: true,
    },
  });

  await prisma.userLogin.create({
    data: {
      employeeId: amit.id,
      username: "amit",
      passwordHash,
      isActive: true,
    },
  });

  await prisma.userLogin.create({
    data: {
      employeeId: rohit.id,
      username: "rohit",
      passwordHash,
      isActive: true,
    },
  });

  await prisma.userLogin.create({
    data: {
      employeeId: simran.id,
      username: "simran",
      passwordHash,
      isActive: true,
    },
  });

  // ============================================================
  // 12. INVENTORY
  // ============================================================

  console.log("📦 Creating inventory batches...");

  /*
    IMPORTANT:
    Your database already has a trigger that prevents inserting
    expired inventory.

    We temporarily disable ONLY that trigger so that the expired
    Dove Soap batch can be inserted for testing the
    expired_inventory view.

    The trigger is enabled again immediately afterward.
  */

  await prisma.$executeRawUnsafe(
    'ALTER TABLE "Inventory" DISABLE TRIGGER prevent_expired_inventory_trigger',
  );

  try {
    await prisma.inventory.createMany({
      data: [
        {
          productId: tataTea.id,
          warehouseId: mainWarehouse.id,
          batchNumber: "TEA-2025-A01",
          quantity: 10,
          manufacturingDate: new Date("2025-09-15"),
          expiryDate: new Date("2026-10-15"),
        },
        {
          productId: tataTea.id,
          warehouseId: mainWarehouse.id,
          batchNumber: "TEA-2026-A02",
          quantity: 30,
          manufacturingDate: new Date("2026-06-15"),
          expiryDate: new Date("2027-06-15"),
        },
        {
          productId: tataTea.id,
          warehouseId: secondaryWarehouse.id,
          batchNumber: "TEA-2026-B01",
          quantity: 20,
          manufacturingDate: new Date("2026-07-01"),
          expiryDate: new Date("2027-07-01"),
        },
        {
          productId: tataCoffee.id,
          warehouseId: mainWarehouse.id,
          batchNumber: "COF-2026-C01",
          quantity: 20,
          manufacturingDate: new Date("2026-05-10"),
          expiryDate: new Date("2027-05-10"),
        },
        {
          productId: tataCoffee.id,
          warehouseId: secondaryWarehouse.id,
          batchNumber: "COF-2026-C02",
          quantity: 15,
          manufacturingDate: new Date("2026-06-20"),
          expiryDate: new Date("2027-06-20"),
        },
        {
          productId: aashirvaadAtta.id,
          warehouseId: mainWarehouse.id,
          batchNumber: "ATTA-2026-A01",
          quantity: 8,
          manufacturingDate: new Date("2026-08-20"),
          expiryDate: new Date("2026-12-20"),
        },
        {
          productId: aashirvaadAtta.id,
          warehouseId: secondaryWarehouse.id,
          batchNumber: "ATTA-2026-A02",
          quantity: 18,
          manufacturingDate: new Date("2026-08-25"),
          expiryDate: new Date("2027-01-10"),
        },
        {
          productId: basmatiRice.id,
          warehouseId: mainWarehouse.id,
          batchNumber: "RICE-2026-D01",
          quantity: 25,
          manufacturingDate: new Date("2026-04-01"),
          expiryDate: new Date("2027-04-01"),
        },
        {
          productId: basmatiRice.id,
          warehouseId: secondaryWarehouse.id,
          batchNumber: "RICE-2026-D02",
          quantity: 12,
          manufacturingDate: new Date("2026-05-15"),
          expiryDate: new Date("2027-05-15"),
        },
        {
          productId: surf.id,
          warehouseId: mainWarehouse.id,
          batchNumber: "SURF-2026-E01",
          quantity: 0,
          manufacturingDate: new Date("2026-03-01"),
          expiryDate: new Date("2027-03-01"),
        },
        {
          productId: surf.id,
          warehouseId: secondaryWarehouse.id,
          batchNumber: "SURF-2026-E02",
          quantity: 7,
          manufacturingDate: new Date("2026-05-01"),
          expiryDate: new Date("2027-05-01"),
        },
        {
          productId: floorCleaner.id,
          warehouseId: mainWarehouse.id,
          batchNumber: "CLN-2026-F01",
          quantity: 18,
          manufacturingDate: new Date("2026-06-01"),
          expiryDate: new Date("2028-06-01"),
        },
        {
          productId: floorCleaner.id,
          warehouseId: cityWarehouse.id,
          batchNumber: "CLN-2026-F02",
          quantity: 10,
          manufacturingDate: new Date("2026-07-01"),
          expiryDate: new Date("2028-07-01"),
        },
        {
          productId: doveShampoo.id,
          warehouseId: mainWarehouse.id,
          batchNumber: "SHP-2026-G01",
          quantity: 22,
          manufacturingDate: new Date("2026-05-01"),
          expiryDate: new Date("2028-05-01"),
        },
        {
          productId: doveShampoo.id,
          warehouseId: secondaryWarehouse.id,
          batchNumber: "SHP-2026-G02",
          quantity: 14,
          manufacturingDate: new Date("2026-06-01"),
          expiryDate: new Date("2028-06-01"),
        },
        {
          productId: doveSoap.id,
          warehouseId: mainWarehouse.id,
          batchNumber: "SOAP-2025-H01",
          quantity: 15,
          manufacturingDate: new Date("2025-05-01"),
          expiryDate: new Date("2026-08-10"),
        },
        {
          productId: doveSoap.id,
          warehouseId: secondaryWarehouse.id,
          batchNumber: "SOAP-2026-H02",
          quantity: 30,
          manufacturingDate: new Date("2026-04-01"),
          expiryDate: new Date("2027-04-01"),
        },
        {
          productId: greenTea.id,
          warehouseId: mainWarehouse.id,
          batchNumber: "GTEA-2026-I01",
          quantity: 16,
          manufacturingDate: new Date("2026-07-01"),
          expiryDate: new Date("2027-07-01"),
        },
        {
          productId: instantCoffee.id,
          warehouseId: mainWarehouse.id,
          batchNumber: "COF-2026-I02",
          quantity: 11,
          manufacturingDate: new Date("2026-06-01"),
          expiryDate: new Date("2027-06-01"),
        },
        {
          productId: multigrainAtta.id,
          warehouseId: secondaryWarehouse.id,
          batchNumber: "ATTA-2026-J01",
          quantity: 14,
          manufacturingDate: new Date("2026-08-01"),
          expiryDate: new Date("2027-01-15"),
        },
        {
          productId: sonaMasooriRice.id,
          warehouseId: secondaryWarehouse.id,
          batchNumber: "RICE-2026-J02",
          quantity: 20,
          manufacturingDate: new Date("2026-05-01"),
          expiryDate: new Date("2027-05-01"),
        },
        {
          productId: detergentLiquid.id,
          warehouseId: mainWarehouse.id,
          batchNumber: "DET-2026-K01",
          quantity: 19,
          manufacturingDate: new Date("2026-05-01"),
          expiryDate: new Date("2028-05-01"),
        },
        {
          productId: dishCleaner.id,
          warehouseId: cityWarehouse.id,
          batchNumber: "CLN-2026-K02",
          quantity: 13,
          manufacturingDate: new Date("2026-06-01"),
          expiryDate: new Date("2028-06-01"),
        },
        {
          productId: doveConditioner.id,
          warehouseId: mainWarehouse.id,
          batchNumber: "COND-2026-L01",
          quantity: 17,
          manufacturingDate: new Date("2026-05-01"),
          expiryDate: new Date("2028-05-01"),
        },
        {
          productId: luxSoap.id,
          warehouseId: secondaryWarehouse.id,
          batchNumber: "SOAP-2026-L02",
          quantity: 24,
          manufacturingDate: new Date("2026-06-01"),
          expiryDate: new Date("2027-06-01"),
        },
      ],
    });
  } finally {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "Inventory" ENABLE TRIGGER prevent_expired_inventory_trigger',
    );
  }

  // ============================================================
  // 13. PURCHASE ORDERS
  // ============================================================

  console.log("🧾 Creating purchase orders...");

  const po1 = await prisma.purchaseOrder.create({
    data: {
      supplierId: tataSupplier.id,
      employeeId: rahul.id,
      orderDate: new Date("2026-09-10"),
      status: "RECEIVED",
      totalAmount: new Prisma.Decimal("33000"),
      remarks: "Regular monthly purchase",
    },
  });

  const po2 = await prisma.purchaseOrder.create({
    data: {
      supplierId: abcSupplier.id,
      employeeId: rahul.id,
      orderDate: new Date("2026-09-15"),
      status: "PENDING",
      totalAmount: new Prisma.Decimal("32500"),
      remarks: "September grocery purchase",
    },
  });

  const po3 = await prisma.purchaseOrder.create({
    data: {
      supplierId: globalSupplier.id,
      employeeId: amit.id,
      orderDate: new Date("2026-09-18"),
      status: "RECEIVED",
      totalAmount: new Prisma.Decimal("18750"),
      remarks: "Rice and cleaning products",
    },
  });

  const po4 = await prisma.purchaseOrder.create({
    data: {
      supplierId: localSupplier.id,
      employeeId: rahul.id,
      orderDate: new Date("2026-09-20"),
      status: "RECEIVED",
      totalAmount: new Prisma.Decimal("25500"),
      remarks: "Personal care stock",
    },
  });

  const po5 = await prisma.purchaseOrder.create({
    data: {
      supplierId: abcSupplier.id,
      employeeId: amit.id,
      orderDate: new Date("2026-09-22"),
      status: "PENDING",
      totalAmount: new Prisma.Decimal("16200"),
      remarks: "Additional household stock",
    },
  });

  // ============================================================
  // 14. PURCHASE ORDER DETAILS
  // ============================================================

  console.log("📋 Creating purchase order details...");

  await prisma.purchaseOrderDetail.createMany({
    data: [
      {
        purchaseOrderId: po1.id,
        productId: tataTea.id,
        quantity: 100,
        unitCost: new Prisma.Decimal("200"),
        totalCost: new Prisma.Decimal("20000"),
      },
      {
        purchaseOrderId: po1.id,
        productId: tataCoffee.id,
        quantity: 50,
        unitCost: new Prisma.Decimal("260"),
        totalCost: new Prisma.Decimal("13000"),
      },

      {
        purchaseOrderId: po2.id,
        productId: aashirvaadAtta.id,
        quantity: 50,
        unitCost: new Prisma.Decimal("380"),
        totalCost: new Prisma.Decimal("19000"),
      },
      {
        purchaseOrderId: po2.id,
        productId: surf.id,
        quantity: 50,
        unitCost: new Prisma.Decimal("270"),
        totalCost: new Prisma.Decimal("13500"),
      },

      {
        purchaseOrderId: po3.id,
        productId: basmatiRice.id,
        quantity: 25,
        unitCost: new Prisma.Decimal("550"),
        totalCost: new Prisma.Decimal("13750"),
      },
      {
        purchaseOrderId: po3.id,
        productId: floorCleaner.id,
        quantity: 35,
        unitCost: new Prisma.Decimal("140"),
        totalCost: new Prisma.Decimal("4900"),
      },

      {
        purchaseOrderId: po4.id,
        productId: doveShampoo.id,
        quantity: 50,
        unitCost: new Prisma.Decimal("230"),
        totalCost: new Prisma.Decimal("11500"),
      },
      {
        purchaseOrderId: po4.id,
        productId: doveSoap.id,
        quantity: 100,
        unitCost: new Prisma.Decimal("55"),
        totalCost: new Prisma.Decimal("5500"),
      },
      {
        purchaseOrderId: po4.id,
        productId: doveConditioner.id,
        quantity: 20,
        unitCost: new Prisma.Decimal("250"),
        totalCost: new Prisma.Decimal("5000"),
      },

      {
        purchaseOrderId: po5.id,
        productId: detergentLiquid.id,
        quantity: 30,
        unitCost: new Prisma.Decimal("330"),
        totalCost: new Prisma.Decimal("9900"),
      },
      {
        purchaseOrderId: po5.id,
        productId: dishCleaner.id,
        quantity: 30,
        unitCost: new Prisma.Decimal("110"),
        totalCost: new Prisma.Decimal("3300"),
      },
      {
        purchaseOrderId: po5.id,
        productId: greenTea.id,
        quantity: 20,
        unitCost: new Prisma.Decimal("140"),
        totalCost: new Prisma.Decimal("2800"),
      },
    ],
  });

  // ============================================================
  // 15. GOODS RECEIPTS
  // ============================================================

  console.log("📥 Creating goods receipts...");

  await prisma.goodsReceipt.createMany({
    data: [
      {
        purchaseOrderId: po1.id,
        productId: tataTea.id,
        warehouseId: mainWarehouse.id,
        employeeId: amit.id,
        batchNumber: "TEA-2026-A02",
        quantityReceived: 30,
        manufacturingDate: new Date("2026-06-15"),
        expiryDate: new Date("2027-06-15"),
        receivedDate: new Date("2026-09-12"),
        remarks: "Tea stock received",
      },
      {
        purchaseOrderId: po1.id,
        productId: tataCoffee.id,
        warehouseId: mainWarehouse.id,
        employeeId: amit.id,
        batchNumber: "COF-2026-C01",
        quantityReceived: 20,
        manufacturingDate: new Date("2026-05-10"),
        expiryDate: new Date("2027-05-10"),
        receivedDate: new Date("2026-09-12"),
        remarks: "Coffee stock received",
      },
      {
        purchaseOrderId: po3.id,
        productId: basmatiRice.id,
        warehouseId: mainWarehouse.id,
        employeeId: amit.id,
        batchNumber: "RICE-2026-D01",
        quantityReceived: 25,
        manufacturingDate: new Date("2026-04-01"),
        expiryDate: new Date("2027-04-01"),
        receivedDate: new Date("2026-09-20"),
        remarks: "Rice stock received",
      },
      {
        purchaseOrderId: po4.id,
        productId: doveShampoo.id,
        warehouseId: mainWarehouse.id,
        employeeId: rohit.id,
        batchNumber: "SHP-2026-G01",
        quantityReceived: 22,
        manufacturingDate: new Date("2026-05-01"),
        expiryDate: new Date("2028-05-01"),
        receivedDate: new Date("2026-09-21"),
        remarks: "Shampoo stock received",
      },
      {
        purchaseOrderId: po4.id,
        productId: doveSoap.id,
        warehouseId: mainWarehouse.id,
        employeeId: rohit.id,
        batchNumber: "SOAP-2026-H02",
        quantityReceived: 30,
        manufacturingDate: new Date("2026-04-01"),
        expiryDate: new Date("2027-04-01"),
        receivedDate: new Date("2026-09-21"),
        remarks: "Soap stock received",
      },
    ],
  });

  // ============================================================
  // 16. PURCHASE RETURNS
  // ============================================================

  console.log("↩️ Creating purchase returns...");

  await prisma.purchaseReturn.createMany({
    data: [
      {
        supplierId: tataSupplier.id,
        productId: tataTea.id,
        employeeId: amit.id,
        batchNumber: "TEA-2025-A01",
        quantity: 5,
        reason: "Damaged packaging",
        returnDate: new Date("2026-09-20"),
        unitCost: new Prisma.Decimal("200"),
        totalAmount: new Prisma.Decimal("1000"),
      },
      {
        supplierId: abcSupplier.id,
        productId: surf.id,
        employeeId: rohit.id,
        batchNumber: "SURF-2026-E02",
        quantity: 2,
        reason: "Damaged outer packaging",
        returnDate: new Date("2026-09-23"),
        unitCost: new Prisma.Decimal("270"),
        totalAmount: new Prisma.Decimal("540"),
      },
    ],
  });

  // ============================================================
  // 17. CUSTOMERS
  // ============================================================

  console.log("👤 Creating customers...");

  const customer1 = await prisma.customer.create({
    data: {
      name: "Rahul Customer",
      email: "rahul.customer@example.com",
      phone: "9000000001",
      address: "Bhopal",
      isActive: true,
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: "Priya Customer",
      email: "priya.customer@example.com",
      phone: "9000000002",
      address: "Indore",
      isActive: true,
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      name: "Amit Customer",
      email: "amit.customer@example.com",
      phone: "9000000003",
      address: "Jabalpur",
      isActive: true,
    },
  });

  const customer4 = await prisma.customer.create({
    data: {
      name: "Neha Customer",
      email: "neha.customer@example.com",
      phone: "9000000004",
      address: "Bhopal",
      isActive: true,
    },
  });

  const customer5 = await prisma.customer.create({
    data: {
      name: "Sneha Customer",
      email: "sneha.customer@example.com",
      phone: "9000000005",
      address: "Bhopal",
      isActive: true,
    },
  });

  const customer6 = await prisma.customer.create({
    data: {
      name: "Arjun Customer",
      email: "arjun.customer@example.com",
      phone: "9000000006",
      address: "Indore",
      isActive: true,
    },
  });

  const customer7 = await prisma.customer.create({
    data: {
      name: "Kavya Customer",
      email: "kavya.customer@example.com",
      phone: "9000000007",
      address: "Jabalpur",
      isActive: false,
    },
  });

  // ============================================================
  // 18. SALES BILLS
  // ============================================================

  console.log("🧾 Creating sales bills...");

  const bill1 = await prisma.salesBill.create({
    data: {
      customerId: customer1.id,
      employeeId: priya.id,
      billDate: new Date("2026-09-20"),
      subtotal: new Prisma.Decimal("3240"),
      taxAmount: new Prisma.Decimal("0"),
      discount: new Prisma.Decimal("0"),
      grandTotal: new Prisma.Decimal("3240"),
      status: "COMPLETED",
    },
  });

  const bill2 = await prisma.salesBill.create({
    data: {
      customerId: customer2.id,
      employeeId: priya.id,
      billDate: new Date("2026-09-21"),
      subtotal: new Prisma.Decimal("1850"),
      taxAmount: new Prisma.Decimal("0"),
      discount: new Prisma.Decimal("0"),
      grandTotal: new Prisma.Decimal("1850"),
      status: "COMPLETED",
    },
  });

  const bill3 = await prisma.salesBill.create({
    data: {
      customerId: customer1.id,
      employeeId: priya.id,
      billDate: new Date("2026-09-22"),
      subtotal: new Prisma.Decimal("4600"),
      taxAmount: new Prisma.Decimal("0"),
      discount: new Prisma.Decimal("0"),
      grandTotal: new Prisma.Decimal("4600"),
      status: "COMPLETED",
    },
  });

  const bill4 = await prisma.salesBill.create({
    data: {
      customerId: customer3.id,
      employeeId: priya.id,
      billDate: new Date("2026-09-23"),
      subtotal: new Prisma.Decimal("960"),
      taxAmount: new Prisma.Decimal("0"),
      discount: new Prisma.Decimal("0"),
      grandTotal: new Prisma.Decimal("960"),
      status: "COMPLETED",
    },
  });

  const bill5 = await prisma.salesBill.create({
    data: {
      customerId: customer1.id,
      employeeId: priya.id,
      billDate: new Date("2026-09-24"),
      subtotal: new Prisma.Decimal("2195"),
      taxAmount: new Prisma.Decimal("0"),
      discount: new Prisma.Decimal("0"),
      grandTotal: new Prisma.Decimal("2195"),
      status: "COMPLETED",
    },
  });

  const bill6 = await prisma.salesBill.create({
    data: {
      customerId: customer4.id,
      employeeId: simran.id,
      billDate: new Date("2026-09-24"),
      subtotal: new Prisma.Decimal("1500"),
      taxAmount: new Prisma.Decimal("0"),
      discount: new Prisma.Decimal("0"),
      grandTotal: new Prisma.Decimal("1500"),
      status: "COMPLETED",
    },
  });

  const bill7 = await prisma.salesBill.create({
    data: {
      customerId: customer5.id,
      employeeId: simran.id,
      billDate: new Date("2026-09-25"),
      subtotal: new Prisma.Decimal("1860"),
      taxAmount: new Prisma.Decimal("0"),
      discount: new Prisma.Decimal("60"),
      grandTotal: new Prisma.Decimal("1800"),
      status: "COMPLETED",
    },
  });

  const bill8 = await prisma.salesBill.create({
    data: {
      customerId: customer6.id,
      employeeId: simran.id,
      billDate: new Date("2026-09-25"),
      subtotal: new Prisma.Decimal("2280"),
      taxAmount: new Prisma.Decimal("0"),
      discount: new Prisma.Decimal("0"),
      grandTotal: new Prisma.Decimal("2280"),
      status: "COMPLETED",
    },
  });

  // ============================================================
  // 19. SALES BILL DETAILS
  // ============================================================

  console.log("📋 Creating sales bill details...");

  await prisma.salesBillDetail.createMany({
    data: [
      // Bill 1 = 3240
      {
        salesBillId: bill1.id,
        productId: tataTea.id,
        quantity: 5,
        unitPrice: new Prisma.Decimal("250"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("1250"),
      },
      {
        salesBillId: bill1.id,
        productId: tataCoffee.id,
        quantity: 2,
        unitPrice: new Prisma.Decimal("320"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("640"),
      },
      {
        salesBillId: bill1.id,
        productId: aashirvaadAtta.id,
        quantity: 3,
        unitPrice: new Prisma.Decimal("450"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("1350"),
      },

      // Bill 2 = 1850
      {
        salesBillId: bill2.id,
        productId: tataTea.id,
        quantity: 4,
        unitPrice: new Prisma.Decimal("250"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("1000"),
      },
      {
        salesBillId: bill2.id,
        productId: doveSoap.id,
        quantity: 2,
        unitPrice: new Prisma.Decimal("75"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("150"),
      },
      {
        salesBillId: bill2.id,
        productId: doveShampoo.id,
        quantity: 2,
        unitPrice: new Prisma.Decimal("280"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("560"),
      },
      {
        salesBillId: bill2.id,
        productId: floorCleaner.id,
        quantity: 1,
        unitPrice: new Prisma.Decimal("140"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("140"),
      },

      // Bill 3 = 4600
      {
        salesBillId: bill3.id,
        productId: tataTea.id,
        quantity: 10,
        unitPrice: new Prisma.Decimal("250"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("2500"),
      },
      {
        salesBillId: bill3.id,
        productId: aashirvaadAtta.id,
        quantity: 4,
        unitPrice: new Prisma.Decimal("450"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("1800"),
      },
      {
        salesBillId: bill3.id,
        productId: doveSoap.id,
        quantity: 4,
        unitPrice: new Prisma.Decimal("75"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("300"),
      },

      // Bill 4 = 960
      {
        salesBillId: bill4.id,
        productId: tataTea.id,
        quantity: 2,
        unitPrice: new Prisma.Decimal("250"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("500"),
      },
      {
        salesBillId: bill4.id,
        productId: doveShampoo.id,
        quantity: 1,
        unitPrice: new Prisma.Decimal("280"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("280"),
      },
      {
        salesBillId: bill4.id,
        productId: floorCleaner.id,
        quantity: 1,
        unitPrice: new Prisma.Decimal("180"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("180"),
      },

      // Bill 5 = 2195
      {
        salesBillId: bill5.id,
        productId: tataTea.id,
        quantity: 6,
        unitPrice: new Prisma.Decimal("250"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("1500"),
      },
      {
        salesBillId: bill5.id,
        productId: tataCoffee.id,
        quantity: 1,
        unitPrice: new Prisma.Decimal("320"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("320"),
      },
      {
        salesBillId: bill5.id,
        productId: doveSoap.id,
        quantity: 5,
        unitPrice: new Prisma.Decimal("75"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("375"),
      },

      // Bill 6 = 1500
      {
        salesBillId: bill6.id,
        productId: greenTea.id,
        quantity: 3,
        unitPrice: new Prisma.Decimal("180"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("540"),
      },
      {
        salesBillId: bill6.id,
        productId: instantCoffee.id,
        quantity: 2,
        unitPrice: new Prisma.Decimal("210"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("420"),
      },
      {
        salesBillId: bill6.id,
        productId: doveSoap.id,
        quantity: 4,
        unitPrice: new Prisma.Decimal("85"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("340"),
      },
      {
        salesBillId: bill6.id,
        productId: dishCleaner.id,
        quantity: 1,
        unitPrice: new Prisma.Decimal("200"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("200"),
      },

      // Bill 7 = 1860
      {
        salesBillId: bill7.id,
        productId: multigrainAtta.id,
        quantity: 2,
        unitPrice: new Prisma.Decimal("520"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("1040"),
      },
      {
        salesBillId: bill7.id,
        productId: sonaMasooriRice.id,
        quantity: 1,
        unitPrice: new Prisma.Decimal("580"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("580"),
      },
      {
        salesBillId: bill7.id,
        productId: detergentLiquid.id,
        quantity: 1,
        unitPrice: new Prisma.Decimal("240"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("240"),
      },

      // Bill 8 = 2280
      {
        salesBillId: bill8.id,
        productId: detergentLiquid.id,
        quantity: 2,
        unitPrice: new Prisma.Decimal("390"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("780"),
      },
      {
        salesBillId: bill8.id,
        productId: doveConditioner.id,
        quantity: 2,
        unitPrice: new Prisma.Decimal("310"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("620"),
      },
      {
        salesBillId: bill8.id,
        productId: floorCleaner.id,
        quantity: 2,
        unitPrice: new Prisma.Decimal("180"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("360"),
      },
      {
        salesBillId: bill8.id,
        productId: doveSoap.id,
        quantity: 4,
        unitPrice: new Prisma.Decimal("75"),
        discount: new Prisma.Decimal("0"),
        totalPrice: new Prisma.Decimal("300"),
      },
      {
        salesBillId: bill8.id,
        productId: tataTea.id,
        quantity: 1,
        unitPrice: new Prisma.Decimal("250"),
        discount: new Prisma.Decimal("30"),
        totalPrice: new Prisma.Decimal("220"),
      },
    ],
  });

  // ============================================================
  // 20. PAYMENTS
  // ============================================================

  console.log("💳 Creating payments...");

  await prisma.payment.createMany({
    data: [
      {
        salesBillId: bill1.id,
        amount: new Prisma.Decimal("3240"),
        paymentMethod: "UPI",
        paymentDate: new Date("2026-09-20"),
        transactionReference: "UPI-10001",
        status: "COMPLETED",
      },
      {
        salesBillId: bill2.id,
        amount: new Prisma.Decimal("1850"),
        paymentMethod: "CASH",
        paymentDate: new Date("2026-09-21"),
        transactionReference: "CASH-10002",
        status: "COMPLETED",
      },
      {
        salesBillId: bill3.id,
        amount: new Prisma.Decimal("4600"),
        paymentMethod: "CARD",
        paymentDate: new Date("2026-09-22"),
        transactionReference: "CARD-10003",
        status: "COMPLETED",
      },
      {
        salesBillId: bill4.id,
        amount: new Prisma.Decimal("960"),
        paymentMethod: "UPI",
        paymentDate: new Date("2026-09-23"),
        transactionReference: "UPI-10004",
        status: "COMPLETED",
      },
      {
        salesBillId: bill5.id,
        amount: new Prisma.Decimal("2195"),
        paymentMethod: "CASH",
        paymentDate: new Date("2026-09-24"),
        transactionReference: "CASH-10005",
        status: "COMPLETED",
      },
      {
        salesBillId: bill6.id,
        amount: new Prisma.Decimal("1500"),
        paymentMethod: "UPI",
        paymentDate: new Date("2026-09-24"),
        transactionReference: "UPI-10006",
        status: "COMPLETED",
      },
      {
        salesBillId: bill7.id,
        amount: new Prisma.Decimal("1800"),
        paymentMethod: "CARD",
        paymentDate: new Date("2026-09-25"),
        transactionReference: "CARD-10007",
        status: "COMPLETED",
      },
      {
        salesBillId: bill8.id,
        amount: new Prisma.Decimal("2280"),
        paymentMethod: "UPI",
        paymentDate: new Date("2026-09-25"),
        transactionReference: "UPI-10008",
        status: "COMPLETED",
      },
    ],
  });

  // ============================================================
  // 21. SALES RETURNS
  // ============================================================

  console.log("↩️ Creating sales returns...");

  await prisma.salesReturn.createMany({
    data: [
      {
        salesBillId: bill2.id,
        productId: tataTea.id,
        employeeId: priya.id,
        batchNumber: "TEA-2026-A02",
        quantity: 1,
        reason: "Customer returned product",
        returnDate: new Date("2026-09-22"),
        refundAmount: new Prisma.Decimal("250"),
      },
      {
        salesBillId: bill3.id,
        productId: doveSoap.id,
        employeeId: priya.id,
        batchNumber: "SOAP-2025-H01",
        quantity: 1,
        reason: "Damaged product",
        returnDate: new Date("2026-09-24"),
        refundAmount: new Prisma.Decimal("75"),
      },
      {
        salesBillId: bill5.id,
        productId: tataCoffee.id,
        employeeId: priya.id,
        batchNumber: "COF-2026-C01",
        quantity: 1,
        reason: "Customer requested return",
        returnDate: new Date("2026-09-25"),
        refundAmount: new Prisma.Decimal("320"),
      },
    ],
  });

  // ============================================================
  // 22. STOCK TRANSACTIONS
  // ============================================================

  console.log("📈 Creating stock transactions...");

  await prisma.stockTransaction.createMany({
    data: [
      {
        productId: tataTea.id,
        warehouseId: mainWarehouse.id,
        employeeId: amit.id,
        transactionType: "PURCHASE",
        quantity: 30,
        referenceType: "PURCHASE_ORDER",
        referenceId: po1.id,
        remarks: "Tea purchase received",
        transactionDate: new Date("2026-09-12"),
      },
      {
        productId: tataTea.id,
        warehouseId: mainWarehouse.id,
        employeeId: priya.id,
        transactionType: "SALE",
        quantity: -5,
        referenceType: "SALES_BILL",
        referenceId: bill1.id,
        remarks: "Tea sold",
        transactionDate: new Date("2026-09-20"),
      },
      {
        productId: tataTea.id,
        warehouseId: mainWarehouse.id,
        employeeId: priya.id,
        transactionType: "SALE",
        quantity: -10,
        referenceType: "SALES_BILL",
        referenceId: bill3.id,
        remarks: "Tea sold",
        transactionDate: new Date("2026-09-22"),
      },
      {
        productId: tataTea.id,
        warehouseId: mainWarehouse.id,
        employeeId: priya.id,
        transactionType: "RETURN",
        quantity: 1,
        referenceType: "SALES_RETURN",
        referenceId: bill2.id,
        remarks: "Tea returned by customer",
        transactionDate: new Date("2026-09-22"),
      },
      {
        productId: aashirvaadAtta.id,
        warehouseId: mainWarehouse.id,
        employeeId: priya.id,
        transactionType: "SALE",
        quantity: -7,
        referenceType: "SALES_BILL",
        referenceId: bill1.id,
        remarks: "Atta sold",
        transactionDate: new Date("2026-09-20"),
      },
      {
        productId: doveShampoo.id,
        warehouseId: mainWarehouse.id,
        employeeId: priya.id,
        transactionType: "SALE",
        quantity: -3,
        referenceType: "SALES_BILL",
        referenceId: bill2.id,
        remarks: "Shampoo sold",
        transactionDate: new Date("2026-09-21"),
      },
      {
        productId: doveSoap.id,
        warehouseId: mainWarehouse.id,
        employeeId: priya.id,
        transactionType: "SALE",
        quantity: -4,
        referenceType: "SALES_BILL",
        referenceId: bill3.id,
        remarks: "Soap sold",
        transactionDate: new Date("2026-09-22"),
      },
      {
        productId: greenTea.id,
        warehouseId: mainWarehouse.id,
        employeeId: simran.id,
        transactionType: "SALE",
        quantity: -3,
        referenceType: "SALES_BILL",
        referenceId: bill6.id,
        remarks: "Green tea sold",
        transactionDate: new Date("2026-09-24"),
      },
      {
        productId: detergentLiquid.id,
        warehouseId: mainWarehouse.id,
        employeeId: simran.id,
        transactionType: "SALE",
        quantity: -2,
        referenceType: "SALES_BILL",
        referenceId: bill8.id,
        remarks: "Detergent sold",
        transactionDate: new Date("2026-09-25"),
      },
      {
        productId: tataCoffee.id,
        warehouseId: mainWarehouse.id,
        employeeId: priya.id,
        transactionType: "SALE",
        quantity: -1,
        referenceType: "SALES_BILL",
        referenceId: bill5.id,
        remarks: "Coffee sold",
        transactionDate: new Date("2026-09-24"),
      },
      {
        productId: tataCoffee.id,
        warehouseId: mainWarehouse.id,
        employeeId: priya.id,
        transactionType: "RETURN",
        quantity: 1,
        referenceType: "SALES_RETURN",
        referenceId: bill5.id,
        remarks: "Coffee returned by customer",
        transactionDate: new Date("2026-09-25"),
      },
      {
        productId: doveSoap.id,
        warehouseId: mainWarehouse.id,
        employeeId: priya.id,
        transactionType: "RETURN",
        quantity: 1,
        referenceType: "SALES_RETURN",
        referenceId: bill3.id,
        remarks: "Soap returned by customer",
        transactionDate: new Date("2026-09-24"),
      },
      {
        productId: surf.id,
        warehouseId: secondaryWarehouse.id,
        employeeId: rohit.id,
        transactionType: "PURCHASE",
        quantity: 7,
        referenceType: "GOODS_RECEIPT",
        referenceId: po2.id,
        remarks: "Detergent stock received",
        transactionDate: new Date("2026-09-23"),
      },
      {
        productId: basmatiRice.id,
        warehouseId: mainWarehouse.id,
        employeeId: amit.id,
        transactionType: "PURCHASE",
        quantity: 25,
        referenceType: "GOODS_RECEIPT",
        referenceId: po3.id,
        remarks: "Rice stock received",
        transactionDate: new Date("2026-09-20"),
      },
      {
        productId: doveShampoo.id,
        warehouseId: mainWarehouse.id,
        employeeId: rohit.id,
        transactionType: "PURCHASE",
        quantity: 22,
        referenceType: "GOODS_RECEIPT",
        referenceId: po4.id,
        remarks: "Shampoo stock received",
        transactionDate: new Date("2026-09-21"),
      },
    ],
  });

  // ============================================================
  // FINAL MESSAGE
  // ============================================================

  console.log("");
  console.log("🎉 DATABASE SEED COMPLETED SUCCESSFULLY!");
  console.log("");
  console.log("📊 Seed summary:");
  console.log("   Categories        : 4");
  console.log("   Subcategories     : 8");
  console.log("   Brands            : 5");
  console.log("   Products          : 16");
  console.log("   Suppliers         : 4");
  console.log("   Warehouses        : 4");
  console.log("   Roles             : 4");
  console.log("   Employees         : 6");
  console.log("   User Logins       : 5");
  console.log("   Reorder Levels    : 12");
  console.log("   Inventory Batches : 24");
  console.log("   Purchase Orders   : 5");
  console.log("   Goods Receipts    : 5");
  console.log("   Purchase Returns  : 2");
  console.log("   Customers         : 7");
  console.log("   Sales Bills       : 8");
  console.log("   Payments          : 8");
  console.log("   Sales Returns     : 3");
  console.log("   Stock Transactions: 15");
  console.log("");
  console.log("🔐 Demo usernames:");
  console.log("   rahul");
  console.log("   priya");
  console.log("   amit");
  console.log("   rohit");
  console.log("   simran");
  console.log("");
  console.log("Passwords are secured using bcrypt.");
  console.log("  Demo password: password123");
  console.log("   authentication is implemented.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

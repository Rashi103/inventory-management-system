import "dotenv/config";
import { PrismaClient } from "@prisma/client";
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

  // =====================================================
  // 1. CLEAR EXISTING DATA
  // =====================================================

  console.log("🗑️ Clearing existing data...");

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
  await prisma.supplier.deleteMany();
  await prisma.warehouse.deleteMany();

  await prisma.product.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();

  // =====================================================
  // 2. CATEGORIES
  // =====================================================

  console.log("📂 Creating categories...");

  const beverages = await prisma.category.create({
    data: {
      name: "Beverages",
      description: "Tea, coffee, juices and other beverages",
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

  // =====================================================
  // 3. SUBCATEGORIES
  // =====================================================

  console.log("📁 Creating subcategories...");

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

  // =====================================================
  // 4. BRANDS
  // =====================================================

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
      description: "Flour and food products",
    },
  });

  const nestle = await prisma.brand.create({
    data: {
      name: "Nestle",
      description: "Food and beverage products",
    },
  });

  const surf = await prisma.brand.create({
    data: {
      name: "Surf Excel",
      description: "Laundry products",
    },
  });

  const dove = await prisma.brand.create({
    data: {
      name: "Dove",
      description: "Personal care products",
    },
  });

  // =====================================================
  // 5. PRODUCTS
  // =====================================================

  console.log("📦 Creating products...");

  const tataTea = await prisma.product.create({
    data: {
      name: "Tata Tea",
      sku: "TEA-001",
      description: "Premium tea",
      price: "250.00",
      costPrice: "200.00",
      unit: "packet",
      categoryId: beverages.id,
      subCategoryId: tea.id,
      brandId: tata.id,
    },
  });

  const tataCoffee = await prisma.product.create({
    data: {
      name: "Tata Coffee",
      sku: "COF-001",
      description: "Instant coffee",
      price: "320.00",
      costPrice: "260.00",
      unit: "packet",
      categoryId: beverages.id,
      subCategoryId: coffee.id,
      brandId: tata.id,
    },
  });

  const aashirvaadAtta = await prisma.product.create({
    data: {
      name: "Aashirvaad Atta",
      sku: "ATTA-001",
      description: "Whole wheat flour",
      price: "450.00",
      costPrice: "380.00",
      unit: "bag",
      categoryId: groceries.id,
      subCategoryId: flour.id,
      brandId: aashirvaad.id,
    },
  });

  const basmatiRice = await prisma.product.create({
    data: {
      name: "Aashirvaad Basmati Rice",
      sku: "RICE-001",
      description: "Premium basmati rice",
      price: "650.00",
      costPrice: "550.00",
      unit: "bag",
      categoryId: groceries.id,
      subCategoryId: rice.id,
      brandId: aashirvaad.id,
    },
  });

  const surfExcel = await prisma.product.create({
    data: {
      name: "Surf Excel",
      sku: "DET-001",
      description: "Laundry detergent",
      price: "320.00",
      costPrice: "270.00",
      unit: "packet",
      categoryId: household.id,
      subCategoryId: detergents.id,
      brandId: surf.id,
    },
  });

  const floorCleaner = await prisma.product.create({
    data: {
      name: "Floor Cleaner",
      sku: "CLN-001",
      description: "Multi-purpose floor cleaner",
      price: "180.00",
      costPrice: "140.00",
      unit: "bottle",
      categoryId: household.id,
      subCategoryId: cleaners.id,
    },
  });

  const doveShampoo = await prisma.product.create({
    data: {
      name: "Dove Shampoo",
      sku: "SHP-001",
      description: "Daily care shampoo",
      price: "280.00",
      costPrice: "230.00",
      unit: "bottle",
      categoryId: personalCare.id,
      subCategoryId: shampoo.id,
      brandId: dove.id,
    },
  });

  const doveSoap = await prisma.product.create({
    data: {
      name: "Dove Soap",
      sku: "SOAP-001",
      description: "Moisturizing soap",
      price: "75.00",
      costPrice: "55.00",
      unit: "piece",
      categoryId: personalCare.id,
      subCategoryId: soap.id,
      brandId: dove.id,
    },
  });

  // =====================================================
  // 6. SUPPLIERS
  // =====================================================

  console.log("🚚 Creating suppliers...");

  const tataSupplier = await prisma.supplier.create({
    data: {
      name: "Tata Consumer Products",
      email: "tata@example.com",
      phone: "9876543210",
      address: "Mumbai, Maharashtra",
      gstNumber: "23ABCDE1234F1Z5",
    },
  });

  const abcSupplier = await prisma.supplier.create({
    data: {
      name: "ABC Wholesale",
      email: "abc@example.com",
      phone: "9876501234",
      address: "Indore, Madhya Pradesh",
      gstNumber: "23XYZAB5678C1Z2",
    },
  });

  const globalSupplier = await prisma.supplier.create({
    data: {
      name: "Global Distributors",
      email: "global@example.com",
      phone: "9988776655",
      address: "Jabalpur, Madhya Pradesh",
      gstNumber: "23PQRST9012D1Z7",
    },
  });

  // =====================================================
  // 7. WAREHOUSES
  // =====================================================

  console.log("🏢 Creating warehouses...");

  const mainWarehouse = await prisma.warehouse.create({
    data: {
      name: "Main Warehouse",
      location: "Bhopal",
      managerName: "Rahul Sharma",
    },
  });

  const secondaryWarehouse = await prisma.warehouse.create({
    data: {
      name: "Secondary Warehouse",
      location: "Indore",
      managerName: "Amit Verma",
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

  // =====================================================
  // 8. ROLES
  // =====================================================

  console.log("👥 Creating roles...");

  const managerRole = await prisma.role.create({
    data: {
      name: "Manager",
      description: "Manages overall inventory operations",
    },
  });

  const salesRole = await prisma.role.create({
    data: {
      name: "Sales Executive",
      description: "Handles customer sales and billing",
    },
  });

  const inventoryRole = await prisma.role.create({
    data: {
      name: "Inventory Staff",
      description: "Manages stock and inventory",
    },
  });

  const accountantRole = await prisma.role.create({
    data: {
      name: "Accountant",
      description: "Handles payments and accounts",
    },
  });

  // =====================================================
  // 9. EMPLOYEES
  // =====================================================

  console.log("👨‍💼 Creating employees...");

  const rahul = await prisma.employee.create({
    data: {
      name: "Rahul Sharma",
      email: "rahul@inventory.com",
      phone: "9876543210",
      address: "Bhopal",
      roleId: managerRole.id,
    },
  });

  const priya = await prisma.employee.create({
    data: {
      name: "Priya Singh",
      email: "priya@inventory.com",
      phone: "9988776655",
      address: "Indore",
      roleId: salesRole.id,
    },
  });

  const amit = await prisma.employee.create({
    data: {
      name: "Amit Verma",
      email: "amit@inventory.com",
      phone: "9876501234",
      address: "Jabalpur",
      roleId: inventoryRole.id,
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

  // =====================================================
  // 10. USER LOGINS
  // =====================================================

  console.log("🔐 Creating user logins...");

  await prisma.userLogin.create({
    data: {
      employeeId: rahul.id,
      username: "rahul",
      passwordHash: "demo_password_hash",
    },
  });

  await prisma.userLogin.create({
    data: {
      employeeId: priya.id,
      username: "priya",
      passwordHash: "demo_password_hash",
    },
  });

  await prisma.userLogin.create({
    data: {
      employeeId: amit.id,
      username: "amit",
      passwordHash: "demo_password_hash",
    },
  });

  // =====================================================
  // 11. REORDER LEVELS
  // =====================================================

  console.log("📊 Creating reorder levels...");

  await prisma.reorderLevel.create({
    data: {
      productId: tataTea.id,
      minimumStock: 10,
      reorderPoint: 15,
      reorderQuantity: 50,
    },
  });

  await prisma.reorderLevel.create({
    data: {
      productId: tataCoffee.id,
      minimumStock: 8,
      reorderPoint: 12,
      reorderQuantity: 30,
    },
  });

  await prisma.reorderLevel.create({
    data: {
      productId: aashirvaadAtta.id,
      minimumStock: 10,
      reorderPoint: 15,
      reorderQuantity: 40,
    },
  });

  await prisma.reorderLevel.create({
    data: {
      productId: basmatiRice.id,
      minimumStock: 10,
      reorderPoint: 15,
      reorderQuantity: 30,
    },
  });

  await prisma.reorderLevel.create({
    data: {
      productId: surfExcel.id,
      minimumStock: 5,
      reorderPoint: 10,
      reorderQuantity: 25,
    },
  });

  // =====================================================
  // 12. INVENTORY
  // =====================================================

  console.log("📦 Creating inventory batches...");

  // Tata Tea - multiple batches for FEFO
  await prisma.inventory.create({
    data: {
      productId: tataTea.id,
      warehouseId: mainWarehouse.id,
      batchNumber: "TEA-2025-A01",
      quantity: 10,
      manufacturingDate: new Date("2025-06-01"),
      expiryDate: new Date("2026-10-15"),
    },
  });

  await prisma.inventory.create({
    data: {
      productId: tataTea.id,
      warehouseId: mainWarehouse.id,
      batchNumber: "TEA-2026-A02",
      quantity: 30,
      manufacturingDate: new Date("2026-06-01"),
      expiryDate: new Date("2027-06-15"),
    },
  });

  // Aashirvaad Atta - low stock
  await prisma.inventory.create({
    data: {
      productId: aashirvaadAtta.id,
      warehouseId: mainWarehouse.id,
      batchNumber: "ATTA-2026-B01",
      quantity: 8,
      manufacturingDate: new Date("2026-07-01"),
      expiryDate: new Date("2026-12-20"),
    },
  });

  // Tata Coffee
  await prisma.inventory.create({
    data: {
      productId: tataCoffee.id,
      warehouseId: mainWarehouse.id,
      batchNumber: "COF-2026-C01",
      quantity: 20,
      manufacturingDate: new Date("2026-05-10"),
      expiryDate: new Date("2027-05-10"),
    },
  });

  // Rice
  await prisma.inventory.create({
    data: {
      productId: basmatiRice.id,
      warehouseId: mainWarehouse.id,
      batchNumber: "RICE-2026-D01",
      quantity: 25,
      manufacturingDate: new Date("2026-04-01"),
      expiryDate: new Date("2027-04-01"),
    },
  });

  // Surf Excel - out of stock
  await prisma.inventory.create({
    data: {
      productId: surfExcel.id,
      warehouseId: secondaryWarehouse.id,
      batchNumber: "DET-2026-E01",
      quantity: 0,
      manufacturingDate: new Date("2026-03-01"),
      expiryDate: new Date("2027-03-01"),
    },
  });

  // Floor Cleaner
  await prisma.inventory.create({
    data: {
      productId: floorCleaner.id,
      warehouseId: secondaryWarehouse.id,
      batchNumber: "CLN-2026-F01",
      quantity: 18,
      manufacturingDate: new Date("2026-06-01"),
      expiryDate: new Date("2028-06-01"),
    },
  });

  // Dove Shampoo
  await prisma.inventory.create({
    data: {
      productId: doveShampoo.id,
      warehouseId: mainWarehouse.id,
      batchNumber: "SHP-2026-G01",
      quantity: 22,
      manufacturingDate: new Date("2026-05-01"),
      expiryDate: new Date("2028-05-01"),
    },
  });

  // Dove Soap - expired
  await prisma.inventory.create({
    data: {
      productId: doveSoap.id,
      warehouseId: mainWarehouse.id,
      batchNumber: "SOAP-2025-H01",
      quantity: 15,
      manufacturingDate: new Date("2025-05-01"),
      expiryDate: new Date("2026-08-10"),
    },
  });

  // =====================================================
  // 13. PURCHASE ORDERS
  // =====================================================

  console.log("🛒 Creating purchase orders...");

  const po1 = await prisma.purchaseOrder.create({
    data: {
      supplierId: tataSupplier.id,
      employeeId: rahul.id,
      orderDate: new Date("2026-09-10"),
      status: "RECEIVED",
      totalAmount: "45000.00",
      remarks: "Regular monthly purchase",
    },
  });

  const po2 = await prisma.purchaseOrder.create({
    data: {
      supplierId: abcSupplier.id,
      employeeId: rahul.id,
      orderDate: new Date("2026-09-15"),
      status: "PENDING",
      totalAmount: "32500.00",
      remarks: "Pending supplier delivery",
    },
  });

  const po3 = await prisma.purchaseOrder.create({
    data: {
      supplierId: globalSupplier.id,
      employeeId: amit.id,
      orderDate: new Date("2026-09-18"),
      status: "RECEIVED",
      totalAmount: "18750.00",
    },
  });

  // =====================================================
  // 14. PURCHASE ORDER DETAILS
  // =====================================================

  console.log("📋 Creating purchase order details...");

  await prisma.purchaseOrderDetail.create({
    data: {
      purchaseOrderId: po1.id,
      productId: tataTea.id,
      quantity: 100,
      unitCost: "200.00",
      totalCost: "20000.00",
    },
  });

  await prisma.purchaseOrderDetail.create({
    data: {
      purchaseOrderId: po1.id,
      productId: tataCoffee.id,
      quantity: 50,
      unitCost: "260.00",
      totalCost: "13000.00",
    },
  });

  await prisma.purchaseOrderDetail.create({
    data: {
      purchaseOrderId: po2.id,
      productId: aashirvaadAtta.id,
      quantity: 50,
      unitCost: "380.00",
      totalCost: "19000.00",
    },
  });

  await prisma.purchaseOrderDetail.create({
    data: {
      purchaseOrderId: po2.id,
      productId: surfExcel.id,
      quantity: 50,
      unitCost: "270.00",
      totalCost: "13500.00",
    },
  });

  await prisma.purchaseOrderDetail.create({
    data: {
      purchaseOrderId: po3.id,
      productId: basmatiRice.id,
      quantity: 25,
      unitCost: "550.00",
      totalCost: "13750.00",
    },
  });

  await prisma.purchaseOrderDetail.create({
    data: {
      purchaseOrderId: po3.id,
      productId: floorCleaner.id,
      quantity: 35,
      unitCost: "140.00",
      totalCost: "5000.00",
    },
  });

  // =====================================================
  // 15. GOODS RECEIPTS
  // =====================================================

  console.log("📥 Creating goods receipts...");

  await prisma.goodsReceipt.create({
    data: {
      purchaseOrderId: po1.id,
      productId: tataTea.id,
      warehouseId: mainWarehouse.id,
      employeeId: amit.id,
      batchNumber: "TEA-2026-A02",
      quantityReceived: 30,
      manufacturingDate: new Date("2026-06-01"),
      expiryDate: new Date("2027-06-15"),
      receivedDate: new Date("2026-09-12"),
    },
  });

  await prisma.goodsReceipt.create({
    data: {
      purchaseOrderId: po1.id,
      productId: tataCoffee.id,
      warehouseId: mainWarehouse.id,
      employeeId: amit.id,
      batchNumber: "COF-2026-C01",
      quantityReceived: 20,
      manufacturingDate: new Date("2026-05-10"),
      expiryDate: new Date("2027-05-10"),
      receivedDate: new Date("2026-09-12"),
    },
  });

  await prisma.goodsReceipt.create({
    data: {
      purchaseOrderId: po3.id,
      productId: basmatiRice.id,
      warehouseId: mainWarehouse.id,
      employeeId: amit.id,
      batchNumber: "RICE-2026-D01",
      quantityReceived: 25,
      manufacturingDate: new Date("2026-04-01"),
      expiryDate: new Date("2027-04-01"),
      receivedDate: new Date("2026-09-20"),
    },
  });

  // =====================================================
  // 16. PURCHASE RETURN
  // =====================================================

  console.log("↩️ Creating purchase returns...");

  await prisma.purchaseReturn.create({
    data: {
      supplierId: tataSupplier.id,
      productId: tataTea.id,
      employeeId: amit.id,
      batchNumber: "TEA-2025-A01",
      quantity: 5,
      reason: "Damaged packaging",
      returnDate: new Date("2026-09-20"),
      unitCost: "200.00",
      totalAmount: "1000.00",
    },
  });

  // =====================================================
  // 17. CUSTOMERS
  // =====================================================

  console.log("👤 Creating customers...");

  const customerRahul = await prisma.customer.create({
    data: {
      name: "Rahul Customer",
      email: "rahul.customer@example.com",
      phone: "9000000001",
      address: "Bhopal",
    },
  });

  const customerPriya = await prisma.customer.create({
    data: {
      name: "Priya Customer",
      email: "priya.customer@example.com",
      phone: "9000000002",
      address: "Indore",
    },
  });

  const customerAmit = await prisma.customer.create({
    data: {
      name: "Amit Customer",
      email: "amit.customer@example.com",
      phone: "9000000003",
      address: "Jabalpur",
    },
  });

  const customerNeha = await prisma.customer.create({
    data: {
      name: "Neha Customer",
      email: "neha.customer@example.com",
      phone: "9000000004",
      address: "Bhopal",
    },
  });

  // =====================================================
  // 18. SALES BILLS
  // =====================================================

  console.log("💰 Creating sales bills...");

  const bill1 = await prisma.salesBill.create({
    data: {
      customerId: customerRahul.id,
      employeeId: priya.id,
      billDate: new Date("2026-09-20"),
      subtotal: "3250.00",
      taxAmount: "0.00",
      discount: "0.00",
      grandTotal: "3250.00",
      status: "COMPLETED",
    },
  });

  const bill2 = await prisma.salesBill.create({
    data: {
      customerId: customerPriya.id,
      employeeId: priya.id,
      billDate: new Date("2026-09-21"),
      subtotal: "1850.00",
      taxAmount: "0.00",
      discount: "0.00",
      grandTotal: "1850.00",
      status: "COMPLETED",
    },
  });

  const bill3 = await prisma.salesBill.create({
    data: {
      customerId: customerRahul.id,
      employeeId: priya.id,
      billDate: new Date("2026-09-22"),
      subtotal: "5400.00",
      taxAmount: "0.00",
      discount: "0.00",
      grandTotal: "5400.00",
      status: "COMPLETED",
    },
  });

  const bill4 = await prisma.salesBill.create({
    data: {
      customerId: customerAmit.id,
      employeeId: priya.id,
      billDate: new Date("2026-09-23"),
      subtotal: "950.00",
      taxAmount: "0.00",
      discount: "0.00",
      grandTotal: "950.00",
      status: "COMPLETED",
    },
  });

  const bill5 = await prisma.salesBill.create({
    data: {
      customerId: customerRahul.id,
      employeeId: priya.id,
      billDate: new Date("2026-09-24"),
      subtotal: "2200.00",
      taxAmount: "0.00",
      discount: "0.00",
      grandTotal: "2200.00",
      status: "COMPLETED",
    },
  });

  // =====================================================
  // 19. SALES BILL DETAILS
  // =====================================================

  console.log("🧾 Creating sales bill details...");

  // Bill 1
  await prisma.salesBillDetail.create({
    data: {
      salesBillId: bill1.id,
      productId: tataTea.id,
      quantity: 5,
      unitPrice: "250.00",
      discount: "0.00",
      totalPrice: "1250.00",
    },
  });

  await prisma.salesBillDetail.create({
    data: {
      salesBillId: bill1.id,
      productId: tataCoffee.id,
      quantity: 2,
      unitPrice: "320.00",
      discount: "0.00",
      totalPrice: "640.00",
    },
  });

  await prisma.salesBillDetail.create({
    data: {
      salesBillId: bill1.id,
      productId: aashirvaadAtta.id,
      quantity: 3,
      unitPrice: "450.00",
      discount: "0.00",
      totalPrice: "1350.00",
    },
  });

  // Bill 2
  await prisma.salesBillDetail.create({
    data: {
      salesBillId: bill2.id,
      productId: tataTea.id,
      quantity: 4,
      unitPrice: "250.00",
      discount: "0.00",
      totalPrice: "1000.00",
    },
  });

  await prisma.salesBillDetail.create({
    data: {
      salesBillId: bill2.id,
      productId: doveSoap.id,
      quantity: 2,
      unitPrice: "75.00",
      discount: "0.00",
      totalPrice: "150.00",
    },
  });

  await prisma.salesBillDetail.create({
    data: {
      salesBillId: bill2.id,
      productId: doveShampoo.id,
      quantity: 2,
      unitPrice: "280.00",
      discount: "0.00",
      totalPrice: "560.00",
    },
  });

  await prisma.salesBillDetail.create({
    data: {
      salesBillId: bill2.id,
      productId: floorCleaner.id,
      quantity: 1,
      unitPrice: "140.00",
      discount: "0.00",
      totalPrice: "140.00",
    },
  });

  // Bill 3
  await prisma.salesBillDetail.create({
    data: {
      salesBillId: bill3.id,
      productId: tataTea.id,
      quantity: 10,
      unitPrice: "250.00",
      discount: "0.00",
      totalPrice: "2500.00",
    },
  });

  await prisma.salesBillDetail.create({
    data: {
      salesBillId: bill3.id,
      productId: aashirvaadAtta.id,
      quantity: 4,
      unitPrice: "450.00",
      discount: "0.00",
      totalPrice: "1800.00",
    },
  });

  await prisma.salesBillDetail.create({
    data: {
      salesBillId: bill3.id,
      productId: doveSoap.id,
      quantity: 4,
      unitPrice: "75.00",
      discount: "0.00",
      totalPrice: "300.00",
    },
  });

  // Bill 4
  await prisma.salesBillDetail.create({
    data: {
      salesBillId: bill4.id,
      productId: tataTea.id,
      quantity: 2,
      unitPrice: "250.00",
      discount: "0.00",
      totalPrice: "500.00",
    },
  });

  await prisma.salesBillDetail.create({
    data: {
      salesBillId: bill4.id,
      productId: doveShampoo.id,
      quantity: 1,
      unitPrice: "280.00",
      discount: "0.00",
      totalPrice: "280.00",
    },
  });

  await prisma.salesBillDetail.create({
    data: {
      salesBillId: bill4.id,
      productId: floorCleaner.id,
      quantity: 1,
      unitPrice: "170.00",
      discount: "0.00",
      totalPrice: "170.00",
    },
  });

  // Bill 5
  await prisma.salesBillDetail.create({
    data: {
      salesBillId: bill5.id,
      productId: tataTea.id,
      quantity: 6,
      unitPrice: "250.00",
      discount: "0.00",
      totalPrice: "1500.00",
    },
  });

  await prisma.salesBillDetail.create({
    data: {
      salesBillId: bill5.id,
      productId: tataCoffee.id,
      quantity: 1,
      unitPrice: "320.00",
      discount: "0.00",
      totalPrice: "320.00",
    },
  });

  await prisma.salesBillDetail.create({
    data: {
      salesBillId: bill5.id,
      productId: doveSoap.id,
      quantity: 5,
      unitPrice: "75.00",
      discount: "0.00",
      totalPrice: "375.00",
    },
  });

  // =====================================================
  // 20. PAYMENTS
  // =====================================================

  console.log("💳 Creating payments...");

  await prisma.payment.create({
    data: {
      salesBillId: bill1.id,
      amount: "3250.00",
      paymentMethod: "UPI",
      paymentDate: new Date("2026-09-20"),
      transactionReference: "UPI-TXN-001",
      status: "COMPLETED",
    },
  });

  await prisma.payment.create({
    data: {
      salesBillId: bill2.id,
      amount: "1850.00",
      paymentMethod: "CASH",
      paymentDate: new Date("2026-09-21"),
      transactionReference: "CASH-002",
      status: "COMPLETED",
    },
  });

  await prisma.payment.create({
    data: {
      salesBillId: bill3.id,
      amount: "5400.00",
      paymentMethod: "CARD",
      paymentDate: new Date("2026-09-22"),
      transactionReference: "CARD-TXN-003",
      status: "COMPLETED",
    },
  });

  await prisma.payment.create({
    data: {
      salesBillId: bill4.id,
      amount: "950.00",
      paymentMethod: "UPI",
      paymentDate: new Date("2026-09-23"),
      transactionReference: "UPI-TXN-004",
      status: "COMPLETED",
    },
  });

  await prisma.payment.create({
    data: {
      salesBillId: bill5.id,
      amount: "2200.00",
      paymentMethod: "CASH",
      paymentDate: new Date("2026-09-24"),
      transactionReference: "CASH-005",
      status: "COMPLETED",
    },
  });

  // =====================================================
  // 21. SALES RETURN
  // =====================================================

  console.log("↩️ Creating sales returns...");

  await prisma.salesReturn.create({
    data: {
      salesBillId: bill2.id,
      productId: tataTea.id,
      employeeId: priya.id,
      batchNumber: "TEA-2026-A02",
      quantity: 1,
      reason: "Customer returned unopened packet",
      returnDate: new Date("2026-09-22"),
      refundAmount: "250.00",
    },
  });

  await prisma.salesReturn.create({
    data: {
      salesBillId: bill3.id,
      productId: doveSoap.id,
      employeeId: priya.id,
      batchNumber: "SOAP-2025-H01",
      quantity: 1,
      reason: "Damaged product",
      returnDate: new Date("2026-09-24"),
      refundAmount: "75.00",
    },
  });

  // =====================================================
  // 22. STOCK TRANSACTIONS
  // =====================================================

  console.log("📊 Creating stock transactions...");

  await prisma.stockTransaction.create({
    data: {
      productId: tataTea.id,
      warehouseId: mainWarehouse.id,
      employeeId: amit.id,
      transactionType: "PURCHASE",
      quantity: 30,
      referenceType: "PURCHASE_ORDER",
      referenceId: po1.id,
      remarks: "Stock received from supplier",
      transactionDate: new Date("2026-09-12"),
    },
  });

  await prisma.stockTransaction.create({
    data: {
      productId: tataTea.id,
      warehouseId: mainWarehouse.id,
      employeeId: priya.id,
      transactionType: "SALE",
      quantity: 5,
      referenceType: "SALES_BILL",
      referenceId: bill1.id,
      remarks: "Stock issued for sale",
      transactionDate: new Date("2026-09-20"),
    },
  });

  await prisma.stockTransaction.create({
    data: {
      productId: tataTea.id,
      warehouseId: mainWarehouse.id,
      employeeId: priya.id,
      transactionType: "SALE",
      quantity: 10,
      referenceType: "SALES_BILL",
      referenceId: bill3.id,
      remarks: "Stock issued for sale",
      transactionDate: new Date("2026-09-22"),
    },
  });

  await prisma.stockTransaction.create({
    data: {
      productId: tataTea.id,
      warehouseId: mainWarehouse.id,
      employeeId: priya.id,
      transactionType: "RETURN",
      quantity: 1,
      referenceType: "SALES_RETURN",
      referenceId: bill2.id,
      remarks: "Customer return added back to stock",
      transactionDate: new Date("2026-09-22"),
    },
  });

  await prisma.stockTransaction.create({
    data: {
      productId: aashirvaadAtta.id,
      warehouseId: mainWarehouse.id,
      employeeId: priya.id,
      transactionType: "SALE",
      quantity: 7,
      referenceType: "SALES_BILL",
      referenceId: bill1.id,
      remarks: "Stock issued for sale",
      transactionDate: new Date("2026-09-20"),
    },
  });

  // =====================================================
  // FINISHED
  // =====================================================

  console.log("");
  console.log("======================================");
  console.log("🎉 DATABASE SEED COMPLETED SUCCESSFULLY");
  console.log("======================================");
  console.log("");
  console.log("Created:");
  console.log("✓ Categories");
  console.log("✓ Subcategories");
  console.log("✓ Brands");
  console.log("✓ Products");
  console.log("✓ Suppliers");
  console.log("✓ Warehouses");
  console.log("✓ Inventory batches");
  console.log("✓ Reorder levels");
  console.log("✓ Roles");
  console.log("✓ Employees");
  console.log("✓ User logins");
  console.log("✓ Purchase orders");
  console.log("✓ Purchase order details");
  console.log("✓ Goods receipts");
  console.log("✓ Purchase returns");
  console.log("✓ Customers");
  console.log("✓ Sales bills");
  console.log("✓ Sales bill details");
  console.log("✓ Payments");
  console.log("✓ Sales returns");
  console.log("✓ Stock transactions");
  console.log("");
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
-- ============================================
-- INVENTORY MANAGEMENT SYSTEM
-- DATABASE VIEWS
-- ============================================

-- 1. Low Stock Products
CREATE OR REPLACE VIEW low_stock_products AS
SELECT
    p.id AS product_id,
    p.name AS product_name,
    p.sku,
    COALESCE(SUM(i.quantity), 0) AS current_stock,
    rl."minimumStock" AS minimum_stock,
    rl."reorderPoint" AS reorder_point,
    rl."reorderQuantity" AS reorder_quantity
FROM "Product" p
LEFT JOIN "Inventory" i
    ON p.id = i."productId"
INNER JOIN "ReorderLevel" rl
    ON p.id = rl."productId"
GROUP BY
    p.id,
    p.name,
    p.sku,
    rl."minimumStock",
    rl."reorderPoint",
    rl."reorderQuantity"
HAVING
    COALESCE(SUM(i.quantity), 0) <= rl."reorderPoint";


-- 2. Product Stock Summary
CREATE OR REPLACE VIEW product_stock_summary AS
SELECT
    p.id AS product_id,
    p.name AS product_name,
    p.sku,
    w.id AS warehouse_id,
    w.name AS warehouse_name,
    COALESCE(SUM(i.quantity), 0) AS stock_quantity,
    COUNT(i.id) AS batch_count
FROM "Product" p
LEFT JOIN "Inventory" i
    ON p.id = i."productId"
LEFT JOIN "Warehouse" w
    ON i."warehouseId" = w.id
GROUP BY
    p.id,
    p.name,
    p.sku,
    w.id,
    w.name;


-- 3. Expired Inventory
CREATE OR REPLACE VIEW expired_inventory AS
SELECT
    i.id AS inventory_id,
    p.id AS product_id,
    p.name AS product_name,
    p.sku,
    w.name AS warehouse_name,
    i."batchNumber" AS batch_number,
    i.quantity,
    i."manufacturingDate" AS manufacturing_date,
    i."expiryDate" AS expiry_date
FROM "Inventory" i
INNER JOIN "Product" p
    ON i."productId" = p.id
INNER JOIN "Warehouse" w
    ON i."warehouseId" = w.id
WHERE
    i."expiryDate" IS NOT NULL
    AND i."expiryDate" < CURRENT_DATE;


-- 4. Inventory Stock Status
CREATE OR REPLACE VIEW inventory_stock_status AS
SELECT
    i.id AS inventory_id,
    p.id AS product_id,
    p.name AS product_name,
    p.sku,
    w.name AS warehouse_name,
    i."batchNumber" AS batch_number,
    i.quantity AS current_stock,
    COALESCE(rl."reorderPoint", 0) AS reorder_point,
    CASE
        WHEN i."expiryDate" IS NOT NULL
             AND i."expiryDate" < CURRENT_DATE
        THEN 'EXPIRED'
        WHEN i.quantity = 0
        THEN 'OUT OF STOCK'
        WHEN rl."reorderPoint" IS NOT NULL
             AND i.quantity <= rl."reorderPoint"
        THEN 'LOW STOCK'
        ELSE 'IN STOCK'
    END AS stock_status,
    i."expiryDate" AS expiry_date
FROM "Inventory" AS i
JOIN "Product" AS p
    ON i."productId" = p.id
JOIN "Warehouse" AS w
    ON i."warehouseId" = w.id
LEFT JOIN "ReorderLevel" AS rl
    ON p.id = rl."productId";


-- 5. Sales Summary
CREATE OR REPLACE VIEW sales_summary AS
SELECT
    s.id AS sales_bill_id,
    s."billDate" AS bill_date,
    COALESCE(c.name, 'Walk-in Customer') AS customer_name,
    s.subtotal,
    s."taxAmount" AS tax_amount,
    s.discount,
    s."grandTotal" AS grand_total,
    s.status
FROM "SalesBill" AS s
LEFT JOIN "Customer" AS c
    ON s."customerId" = c.id;


-- 6. Product Sales Summary
CREATE OR REPLACE VIEW product_sales_summary AS
SELECT
    p.id AS product_id,
    p.name AS product_name,
    p.sku,
    COALESCE(SUM(sbd.quantity), 0) AS total_quantity_sold,
    COALESCE(SUM(sbd."totalPrice"), 0) AS total_revenue
FROM "Product" AS p
LEFT JOIN "SalesBillDetail" AS sbd
    ON p.id = sbd."productId"
GROUP BY
    p.id,
    p.name,
    p.sku;


-- 7. Customer Purchase Summary
CREATE OR REPLACE VIEW customer_purchase_summary AS
SELECT
    c.id AS customer_id,
    c.name AS customer_name,
    c.email,
    c.phone,
    COUNT(s.id) AS total_bills,
    COALESCE(SUM(s."grandTotal"), 0) AS total_purchase_amount
FROM "Customer" AS c
LEFT JOIN "SalesBill" AS s
    ON c.id = s."customerId"
GROUP BY
    c.id,
    c.name,
    c.email,
    c.phone;
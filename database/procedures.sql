-- ============================================
-- INVENTORY MANAGEMENT SYSTEM
-- STORED FUNCTIONS & PROCEDURES
-- ============================================


-- 1. Get Total Stock of a Product
CREATE OR REPLACE FUNCTION get_total_product_stock(
    p_product_id INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $function$
DECLARE
    total_stock INTEGER;
BEGIN
    SELECT COALESCE(SUM(quantity), 0)
    INTO total_stock
    FROM "Inventory"
    WHERE "productId" = p_product_id;

    RETURN total_stock;
END;
$function$;


-- 2. Update Inventory Stock
CREATE OR REPLACE PROCEDURE update_inventory_stock(
    p_product_id INTEGER,
    p_warehouse_id INTEGER,
    p_batch_number TEXT,
    p_quantity_change INTEGER
)
LANGUAGE plpgsql
AS $procedure$
DECLARE
    current_quantity INTEGER;
BEGIN

    SELECT quantity
    INTO current_quantity
    FROM "Inventory"
    WHERE "productId" = p_product_id
      AND "warehouseId" = p_warehouse_id
      AND "batchNumber" = p_batch_number;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Inventory batch not found';
    END IF;

    IF current_quantity + p_quantity_change < 0 THEN
        RAISE EXCEPTION
            'Insufficient stock. Current quantity: %, requested change: %',
            current_quantity,
            p_quantity_change;
    END IF;

    UPDATE "Inventory"
    SET
        quantity = quantity + p_quantity_change,
        "updatedAt" = CURRENT_TIMESTAMP
    WHERE "productId" = p_product_id
      AND "warehouseId" = p_warehouse_id
      AND "batchNumber" = p_batch_number;

END;
$procedure$;
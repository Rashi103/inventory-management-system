-- ============================================
-- INVENTORY MANAGEMENT SYSTEM
-- DATABASE TRIGGERS
-- ============================================


-- 1. Calculate Sales Grand Total
CREATE OR REPLACE FUNCTION calculate_sales_grand_total()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $function$
BEGIN
    NEW."grandTotal" :=
        COALESCE(NEW.subtotal, 0)
        + COALESCE(NEW."taxAmount", 0)
        - COALESCE(NEW.discount, 0);

    RETURN NEW;
END;
$function$;


DROP TRIGGER IF EXISTS sales_grand_total_trigger
ON "SalesBill";

CREATE TRIGGER sales_grand_total_trigger
BEFORE INSERT OR UPDATE
ON "SalesBill"
FOR EACH ROW
EXECUTE FUNCTION calculate_sales_grand_total();


-- 2. Validate Inventory Quantity
CREATE OR REPLACE FUNCTION validate_inventory_quantity()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.quantity < 0 THEN
        RAISE EXCEPTION
            'Inventory quantity cannot be negative. Given quantity: %',
            NEW.quantity;
    END IF;

    RETURN NEW;
END;
$function$;


DROP TRIGGER IF EXISTS validate_inventory_quantity_trigger
ON "Inventory";

CREATE TRIGGER validate_inventory_quantity_trigger
BEFORE INSERT OR UPDATE
ON "Inventory"
FOR EACH ROW
EXECUTE FUNCTION validate_inventory_quantity();


-- 3. Prevent Expired Inventory
CREATE OR REPLACE FUNCTION prevent_expired_inventory()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW."expiryDate" IS NOT NULL
       AND NEW."expiryDate" < CURRENT_DATE THEN

        RAISE EXCEPTION
            'Cannot add or update expired inventory. Expiry date: %',
            NEW."expiryDate";

    END IF;

    RETURN NEW;
END;
$function$;


DROP TRIGGER IF EXISTS prevent_expired_inventory_trigger
ON "Inventory";

CREATE TRIGGER prevent_expired_inventory_trigger
BEFORE INSERT OR UPDATE
ON "Inventory"
FOR EACH ROW
EXECUTE FUNCTION prevent_expired_inventory();
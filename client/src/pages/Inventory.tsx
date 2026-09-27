import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import api from "../services/axios";
import "./Inventory.css";
interface Product {
  id: number;
  name: string;
  sku: string;
}

interface Warehouse {
  id: number;
  name: string;
}

interface InventoryItem {
  id: number;
  batchNumber: string;
  quantity: number;
  manufacturingDate: string | null;
  expiryDate: string | null;
  product: Product;
  warehouse: Warehouse;
}

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [warehouseFilter, setWarehouseFilter] =
    useState("all");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const fetchInventory = async () => {
    try {
      setLoading(true);

      const response = await api.get("/inventory");

      setInventory(response.data);
      setError("");
    } catch (error) {
      console.error(
        "Error fetching inventory:",
        error
      );

      setError(
        "Failed to load inventory. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await api.get("/warehouses");

      setWarehouses(response.data);
    } catch (error) {
      console.error(
        "Error fetching warehouses:",
        error
      );
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchWarehouses();
  }, []);

  // =========================
  // DATE HELPERS
  // =========================

  const isExpired = (
    expiryDate: string | null
  ) => {
    if (!expiryDate) return false;

    return (
      new Date(expiryDate).getTime() <
      new Date().getTime()
    );
  };

  const getStatus = (
    item: InventoryItem
  ) => {
    if (isExpired(item.expiryDate)) {
      return {
        label: "Expired",
        className: "expired",
      };
    }

    if (item.quantity === 0) {
      return {
        label: "Out of Stock",
        className: "out",
      };
    }

    if (item.quantity <= 10) {
      return {
        label: "Low Stock",
        className: "low",
      };
    }

    return {
      label: "In Stock",
      className: "in",
    };
  };

  // =========================
  // SUMMARY
  // =========================

  const totalUnits = inventory.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  const activeBatches = inventory.filter(
    (item) => item.quantity > 0
  ).length;

  const lowStockItems = inventory.filter(
    (item) =>
      item.quantity > 0 &&
      item.quantity <= 10 &&
      !isExpired(item.expiryDate)
  ).length;

  const expiredItems = inventory.filter(
    (item) =>
      isExpired(item.expiryDate)
  ).length;

  const outOfStockItems = inventory.filter(
    (item) => item.quantity === 0
  ).length;

  // =========================
  // FILTER
  // =========================

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const search =
        searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        item.product.name
          .toLowerCase()
          .includes(search) ||
        item.product.sku
          .toLowerCase()
          .includes(search) ||
        item.batchNumber
          .toLowerCase()
          .includes(search) ||
        item.warehouse.name
          .toLowerCase()
          .includes(search);

      const matchesWarehouse =
        warehouseFilter === "all" ||
        String(item.warehouse.id) ===
          warehouseFilter;

      const status = getStatus(item);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "in" &&
          status.className === "in") ||
        (statusFilter === "low" &&
          status.className === "low") ||
        (statusFilter === "out" &&
          status.className === "out") ||
        (statusFilter === "expired" &&
          status.className === "expired");

      return (
        matchesSearch &&
        matchesWarehouse &&
        matchesStatus
      );
    });
  }, [
    inventory,
    searchTerm,
    warehouseFilter,
    statusFilter,
  ]);

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (
    date: string | null
  ) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="inventory-page">
        <div className="inventory-loading">
          <div className="inventory-spinner"></div>
          <p>Loading inventory...</p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="inventory-page">
        <div className="inventory-error">
          <div className="inventory-error-icon">
            !
          </div>

          <h2>Inventory unavailable</h2>

          <p>{error}</p>

          <button
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-page">

      {/* HEADER */}

      <div className="inventory-header">

        <div>
          <div className="inventory-breadcrumb">
            Dashboard / Inventory
          </div>

          <h1>Inventory</h1>

          <p>
            Monitor stock levels, batches,
            warehouses and expiry dates.
          </p>
        </div>

        <div className="inventory-header-info">
          <span>Last updated</span>
          <strong>
            {new Date().toLocaleTimeString(
              "en-IN",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </strong>
        </div>

      </div>

      {/* SUMMARY CARDS */}

      <div className="inventory-stats">

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon purple">
            📦
          </div>

          <div>
            <span>Total Units</span>
            <strong>
              {totalUnits.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon green">
            ✓
          </div>

          <div>
            <span>Active Batches</span>
            <strong>
              {activeBatches}
            </strong>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon orange">
            ⚠
          </div>

          <div>
            <span>Low Stock</span>
            <strong>
              {lowStockItems}
            </strong>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="inventory-stat-icon red">
            !
          </div>

          <div>
            <span>Expired</span>
            <strong>
              {expiredItems}
            </strong>
          </div>
        </div>

      </div>

      {/* SECONDARY SUMMARY */}

      <div className="inventory-summary-strip">

        <div>
          <span>Total Inventory Records</span>
          <strong>{inventory.length}</strong>
        </div>

        <div>
          <span>Out of Stock</span>
          <strong className="summary-red">
            {outOfStockItems}
          </strong>
        </div>

        <div>
          <span>Warehouses</span>
          <strong>
            {warehouses.length}
          </strong>
        </div>

        <div>
          <span>Showing</span>
          <strong>
            {filteredInventory.length}
          </strong>
        </div>

      </div>

      {/* INVENTORY TABLE */}

      <div className="inventory-list-card">

        <div className="inventory-list-header">

          <div>
            <h2>Inventory Records</h2>

            <p>
              {filteredInventory.length} of{" "}
              {inventory.length} records
            </p>
          </div>

          <div className="inventory-filters">

            <div className="inventory-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search product, SKU, batch..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />
            </div>

            <select
              value={warehouseFilter}
              onChange={(e) =>
                setWarehouseFilter(
                  e.target.value
                )
              }
            >
              <option value="all">
                All Warehouses
              </option>

              {warehouses.map(
                (warehouse) => (
                  <option
                    key={warehouse.id}
                    value={warehouse.id}
                  >
                    {warehouse.name}
                  </option>
                )
              )}
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >
              <option value="all">
                All Status
              </option>

              <option value="in">
                In Stock
              </option>

              <option value="low">
                Low Stock
              </option>

              <option value="out">
                Out of Stock
              </option>

              <option value="expired">
                Expired
              </option>
            </select>

          </div>

        </div>

        {filteredInventory.length === 0 ? (
          <div className="inventory-empty">

            <div className="inventory-empty-icon">
              📦
            </div>

            <h3>
              No inventory records found
            </h3>

            <p>
              Try changing your search or
              filters.
            </p>

          </div>
        ) : (
          <div className="inventory-table-wrapper">

            <table className="inventory-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Batch</th>
                  <th>Warehouse</th>
                  <th>Quantity</th>
                  <th>Manufactured</th>
                  <th>Expiry</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredInventory.map(
                  (item) => {
                    const status =
                      getStatus(item);

                    return (
                      <tr
                        key={item.id}
                        className={
                          status.className ===
                          "expired"
                            ? "expired-row"
                            : ""
                        }
                      >

                        {/* PRODUCT */}

                        <td>
                          <div className="inventory-product">

                            <div className="inventory-product-icon">
                              {item.product.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {
                                  item
                                    .product
                                    .name
                                }
                              </strong>

                              <span>
                                Product ID:{" "}
                                {
                                  item
                                    .product
                                    .id
                                }
                              </span>
                            </div>

                          </div>
                        </td>

                        {/* SKU */}

                        <td>
                          <span className="inventory-sku">
                            {
                              item.product
                                .sku
                            }
                          </span>
                        </td>

                        {/* BATCH */}

                        <td>
                          <span className="batch-badge">
                            {item.batchNumber}
                          </span>
                        </td>

                        {/* WAREHOUSE */}

                        <td>
                          <div className="warehouse-cell">
                            <span className="warehouse-icon">
                              🏭
                            </span>

                            {
                              item
                                .warehouse
                                .name
                            }
                          </div>
                        </td>

                        {/* QUANTITY */}

                        <td>
                          <div
                            className={`quantity-cell ${status.className}`}
                          >
                            <strong>
                              {Number(
                                item.quantity
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>

                            <span>units</span>
                          </div>
                        </td>

                        {/* MANUFACTURING */}

                        <td>
                          <span className="date-text">
                            {formatDate(
                              item.manufacturingDate
                            )}
                          </span>
                        </td>

                        {/* EXPIRY */}

                        <td>
                          <div
                            className={`expiry-cell ${
                              isExpired(
                                item.expiryDate
                              )
                                ? "expiry-danger"
                                : ""
                            }`}
                          >
                            <span>
                              {formatDate(
                                item.expiryDate
                              )}
                            </span>

                            {isExpired(
                              item.expiryDate
                            ) && (
                              <small>
                                Expired
                              </small>
                            )}
                          </div>
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className={`inventory-status ${status.className}`}
                          >
                            <span></span>
                            {status.label}
                          </span>
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default Inventory;


import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Warehouse.css";
import api from "../services/axios";
interface Warehouse {
  id: number;
  name: string;
  location: string | null;
  managerName: string | null;
  isActive: boolean;
  inventories: { id: number }[];
  stockTransactions: { id: number }[];
  goodsReceipts: { id: number }[];
}

const Warehouse = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // =========================
  // FETCH WAREHOUSES
  // =========================

  const fetchWarehouses = async () => {
    try {
      setLoading(true);

      const response = await api.get("/warehouses");

      setWarehouses(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching warehouses:", error);

      setError(
        "Failed to load warehouses. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  // =========================
  // FILTER
  // =========================

  const filteredWarehouses = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return warehouses.filter((warehouse) => {
      const matchesSearch =
        !search ||
        warehouse.name.toLowerCase().includes(search) ||
        (warehouse.location || "")
          .toLowerCase()
          .includes(search) ||
        (warehouse.managerName || "")
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          warehouse.isActive) ||
        (statusFilter === "inactive" &&
          !warehouse.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [warehouses, searchTerm, statusFilter]);

  // =========================
  // SUMMARY
  // =========================

  const activeWarehouses = warehouses.filter(
    (warehouse) => warehouse.isActive
  ).length;

  const inactiveWarehouses = warehouses.filter(
    (warehouse) => !warehouse.isActive
  ).length;

  const totalInventoryRecords = warehouses.reduce(
    (total, warehouse) =>
      total + (warehouse.inventories?.length || 0),
    0
  );

  const totalTransactions = warehouses.reduce(
    (total, warehouse) =>
      total +
      (warehouse.stockTransactions?.length || 0),
    0
  );

  const totalGoodsReceipts = warehouses.reduce(
    (total, warehouse) =>
      total +
      (warehouse.goodsReceipts?.length || 0),
    0
  );

  return (
    <div className="warehouse-page">

      {/* HEADER */}

      <div className="warehouse-header">

        <div>
          <div className="warehouse-breadcrumb">
            Dashboard / Warehouse
          </div>

          <h1>Warehouses</h1>

          <p>
            Manage storage locations, inventory records
            and warehouse activity.
          </p>
        </div>

      </div>

      {/* STATS */}

      <div className="warehouse-stats">

        <div className="warehouse-stat-card">
          <div className="warehouse-stat-icon purple">
            🏢
          </div>

          <div>
            <span>Total Warehouses</span>
            <strong>{warehouses.length}</strong>
          </div>
        </div>

        <div className="warehouse-stat-card">
          <div className="warehouse-stat-icon green">
            ✓
          </div>

          <div>
            <span>Active Warehouses</span>
            <strong>{activeWarehouses}</strong>
          </div>
        </div>

        <div className="warehouse-stat-card">
          <div className="warehouse-stat-icon blue">
            📦
          </div>

          <div>
            <span>Inventory Records</span>
            <strong>{totalInventoryRecords}</strong>
          </div>
        </div>

        <div className="warehouse-stat-card">
          <div className="warehouse-stat-icon orange">
            ↗
          </div>

          <div>
            <span>Stock Transactions</span>
            <strong>{totalTransactions}</strong>
          </div>
        </div>

      </div>

      {/* SUMMARY STRIP */}

      <div className="warehouse-summary-strip">

        <div className="warehouse-summary-item">
          <span>Active</span>
          <strong>{activeWarehouses}</strong>
        </div>

        <div className="warehouse-summary-divider"></div>

        <div className="warehouse-summary-item">
          <span>Inactive</span>
          <strong>{inactiveWarehouses}</strong>
        </div>

        <div className="warehouse-summary-divider"></div>

        <div className="warehouse-summary-item">
          <span>Goods Receipts</span>
          <strong>{totalGoodsReceipts}</strong>
        </div>

        <div className="warehouse-summary-divider"></div>

        <div className="warehouse-summary-item">
          <span>Showing</span>
          <strong>
            {filteredWarehouses.length} warehouses
          </strong>
        </div>

      </div>

      {/* WAREHOUSE LIST */}

      <div className="warehouse-list-card">

        <div className="warehouse-list-header">

          <div>
            <h2>Warehouse Locations</h2>

            <p>
              {filteredWarehouses.length} of{" "}
              {warehouses.length} warehouses
            </p>
          </div>

          <div className="warehouse-filters">

            <div className="warehouse-search">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search warehouses..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="all">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>

          </div>

        </div>

        {filteredWarehouses.length === 0 ? (
          <div className="warehouse-empty">

            <div className="warehouse-empty-icon">
              🏢
            </div>

            <h3>No warehouses found</h3>

            <p>
              Try changing your search or status filter.
            </p>

          </div>
        ) : (
          <div className="warehouse-table-wrapper">

            <table className="warehouse-table">

              <thead>
                <tr>
                  <th>Warehouse</th>
                  <th>Location</th>
                  <th>Manager</th>
                  <th>Inventory</th>
                  <th>Transactions</th>
                  <th>Receipts</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredWarehouses.map(
                  (warehouse) => (

                    <tr key={warehouse.id}>

                      {/* WAREHOUSE */}

                      <td>
                        <div className="warehouse-profile">

                          <div className="warehouse-icon">
                            🏢
                          </div>

                          <div>
                            <strong>
                              {warehouse.name}
                            </strong>

                            <span>
                              Warehouse ID:{" "}
                              {warehouse.id}
                            </span>
                          </div>

                        </div>
                      </td>

                      {/* LOCATION */}

                      <td>
                        <div className="warehouse-location">
                          <span className="location-symbol">
                            ⌖
                          </span>

                          <span>
                            {warehouse.location ||
                              "Not specified"}
                          </span>
                        </div>
                      </td>

                      {/* MANAGER */}

                      <td>
                        <div className="warehouse-manager">

                          <div className="manager-avatar">
                            {(
                              warehouse.managerName ||
                              "U"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <span>
                            {warehouse.managerName ||
                              "Not assigned"}
                          </span>

                        </div>
                      </td>

                      {/* INVENTORY */}

                      <td>
                        <span className="warehouse-count purple-count">
                          {warehouse.inventories?.length ||
                            0}
                        </span>
                      </td>

                      {/* TRANSACTIONS */}

                      <td>
                        <span className="warehouse-count blue-count">
                          {warehouse.stockTransactions
                            ?.length || 0}
                        </span>
                      </td>

                      {/* RECEIPTS */}

                      <td>
                        <span className="warehouse-count orange-count">
                          {warehouse.goodsReceipts
                            ?.length || 0}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`warehouse-status ${
                            warehouse.isActive
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          <span></span>

                          {warehouse.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* INFO STRIP */}

      <div className="warehouse-info-strip">

        <div className="warehouse-info-icon">
          📦
        </div>

        <div>
          <strong>Warehouse Activity</strong>

          <p>
            Each warehouse is connected with inventory,
            stock transactions and goods receipts.
          </p>
        </div>

        <div className="warehouse-info-summary">
          <span>Inventory Records</span>

          <strong>{totalInventoryRecords}</strong>
        </div>

      </div>

    </div>
  );
};

export default Warehouse;



import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Purchases.css";
import api from "../services/axios";
interface Supplier {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
}

interface PurchaseOrderDetail {
  id: number;
  productId: number;
  quantity: number;
  unitCost: string | number;
  totalCost: string | number;
  product: Product;
}

interface GoodsReceipt {
  id: number;
  quantityReceived: number;
}

interface PurchaseOrder {
  id: number;
  supplierId: number;
  employeeId: number;
  orderDate: string;
  status: string;
  totalAmount: string | number;
  remarks: string | null;
  supplier: Supplier;
  employee: Employee;
  details: PurchaseOrderDetail[];
  goodsReceipts: GoodsReceipt[];
}

const Purchases = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<
    PurchaseOrder[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // =========================
  // FETCH PURCHASE ORDERS
  // =========================

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("/purchases");

      setPurchaseOrders(response.data);
      setError("");
    } catch (error) {
      console.error(
        "Error fetching purchase orders:",
        error
      );

      setError(
        "Failed to load purchases. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  // =========================
  // FILTER
  // =========================

  const filteredOrders = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return purchaseOrders.filter((order) => {
      const orderNumber = `po-2026-${String(order.id).padStart(
        3,
        "0"
      )}`;

      const matchesSearch =
        !search ||
        orderNumber.toLowerCase().includes(search) ||
        order.supplier.name
          .toLowerCase()
          .includes(search) ||
        order.employee.name
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        order.status.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [purchaseOrders, searchTerm, statusFilter]);

  // =========================
  // SUMMARY
  // =========================

  const totalPurchaseValue = purchaseOrders.reduce(
    (total, order) =>
      total + Number(order.totalAmount || 0),
    0
  );

  const totalItems = purchaseOrders.reduce(
    (total, order) =>
      total +
      (order.details || []).reduce(
        (sum, detail) =>
          sum + Number(detail.quantity || 0),
        0
      ),
    0
  );

  const pendingOrders = purchaseOrders.filter(
    (order) =>
      order.status.toUpperCase() === "PENDING"
  ).length;

  const receivedOrders = purchaseOrders.filter(
    (order) =>
      order.status.toUpperCase() === "RECEIVED" ||
      order.status.toUpperCase() === "COMPLETED"
  ).length;

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date: string) => {
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
  // STATUS CLASS
  // =========================

  const getStatusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "pending";

      case "RECEIVED":
      case "COMPLETED":
        return "completed";

      case "CANCELLED":
      case "CANCELED":
        return "cancelled";

      default:
        return "other";
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="purchases-page">
        <div className="purchases-loading">
          <div className="purchases-spinner"></div>
          <p>Loading purchases...</p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="purchases-page">
        <div className="purchases-error">
          <div className="purchases-error-icon">
            !
          </div>

          <h2>Purchases unavailable</h2>

          <p>{error}</p>

          <button
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="purchases-page">

      {/* HEADER */}

      <div className="purchases-header">

        <div>
          <div className="purchases-breadcrumb">
            Dashboard / Purchases
          </div>

          <h1>Purchases</h1>

          <p>
            Track purchase orders, suppliers and
            incoming stock.
          </p>
        </div>

      </div>

      {/* STATS */}

      <div className="purchases-stats">

        <div className="purchase-stat-card">
          <div className="purchase-stat-icon purple">
            📋
          </div>

          <div>
            <span>Total Purchase Orders</span>
            <strong>
              {purchaseOrders.length}
            </strong>
          </div>
        </div>

        <div className="purchase-stat-card">
          <div className="purchase-stat-icon blue">
            ₹
          </div>

          <div>
            <span>Purchase Value</span>
            <strong>
              ₹
              {totalPurchaseValue.toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>
        </div>

        <div className="purchase-stat-card">
          <div className="purchase-stat-icon orange">
            ⏳
          </div>

          <div>
            <span>Pending Orders</span>
            <strong>{pendingOrders}</strong>
          </div>
        </div>

        <div className="purchase-stat-card">
          <div className="purchase-stat-icon green">
            ✓
          </div>

          <div>
            <span>Received Orders</span>
            <strong>{receivedOrders}</strong>
          </div>
        </div>

      </div>

      {/* SUMMARY STRIP */}

      <div className="purchase-summary-strip">

        <div className="purchase-summary-item">
          <span>Total Items Ordered</span>
          <strong>{totalItems}</strong>
        </div>

        <div className="purchase-summary-divider"></div>

        <div className="purchase-summary-item">
          <span>Suppliers Involved</span>
          <strong>
            {
              new Set(
                purchaseOrders.map(
                  (order) => order.supplierId
                )
              ).size
            }
          </strong>
        </div>

        <div className="purchase-summary-divider"></div>

        <div className="purchase-summary-item">
          <span>Showing</span>
          <strong>
            {filteredOrders.length} orders
          </strong>
        </div>

      </div>

      {/* PURCHASE LIST */}

      <div className="purchases-list-card">

        <div className="purchases-list-header">

          <div>
            <h2>Purchase Orders</h2>

            <p>
              {filteredOrders.length} of{" "}
              {purchaseOrders.length} purchase orders
            </p>
          </div>

          <div className="purchases-filters">

            <div className="purchases-search">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search purchase orders..."
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

              <option value="PENDING">
                Pending
              </option>

              <option value="RECEIVED">
                Received
              </option>

              <option value="COMPLETED">
                Completed
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>
            </select>

          </div>

        </div>

        {filteredOrders.length === 0 ? (
          <div className="purchases-empty">

            <div className="purchases-empty-icon">
              📋
            </div>

            <h3>No purchase orders found</h3>

            <p>
              Try changing your search or status
              filter.
            </p>

          </div>
        ) : (
          <div className="purchases-table-wrapper">

            <table className="purchases-table">

              <thead>
                <tr>
                  <th>Purchase Order</th>
                  <th>Supplier</th>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredOrders.map((order) => {

                  const itemCount =
                    (order.details || []).reduce(
                      (total, detail) =>
                        total +
                        Number(
                          detail.quantity || 0
                        ),
                      0
                    );

                  const statusClass =
                    getStatusClass(order.status);

                  return (
                    <tr key={order.id}>

                      <td>
                        <div className="purchase-order-profile">

                          <div className="purchase-order-icon">
                            #
                          </div>

                          <div>
                            <strong>
                              PO-2026-
                              {String(
                                order.id
                              ).padStart(3, "0")}
                            </strong>

                            <span>
                              {order.details?.length ||
                                0}{" "}
                              product types
                            </span>
                          </div>

                        </div>
                      </td>

                      <td>
                        <div className="purchase-supplier">

                          <strong>
                            {order.supplier.name}
                          </strong>

                          <span>
                            Supplier ID:{" "}
                            {order.supplier.id}
                          </span>

                        </div>
                      </td>

                      <td>
                        <div className="purchase-employee">

                          <div className="employee-mini-avatar">
                            {order.employee.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <span>
                            {order.employee.name}
                          </span>

                        </div>
                      </td>

                      <td>
                        <span className="purchase-date">
                          {formatDate(
                            order.orderDate
                          )}
                        </span>
                      </td>

                      <td>
                        <span className="purchase-item-count">
                          {itemCount}
                        </span>
                      </td>

                      <td>
                        <strong className="purchase-amount">
                          ₹
                          {Number(
                            order.totalAmount
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`purchase-status ${statusClass}`}
                        >
                          <span></span>

                          {order.status}
                        </span>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* INFORMATION STRIP */}

      <div className="purchase-info-strip">

        <div className="purchase-info-icon">
          📦
        </div>

        <div>
          <strong>Purchase Tracking</strong>

          <p>
            Purchase orders are linked with suppliers,
            employees and their individual product
            details.
          </p>
        </div>

        <div className="purchase-info-summary">
          <span>Total Items</span>
          <strong>{totalItems}</strong>
        </div>

      </div>

    </div>
  );
};

export default Purchases;


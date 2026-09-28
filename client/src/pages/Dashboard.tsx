import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";
import api from "../services/axios";
import { useAuth } from "../context/AuthContext";
import { getSalesPeriodReport } from "../services/reportServices";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: string | number;
  costPrice: string | number;
  unit: string;
  isActive: boolean;
  category?: {
    id: number;
    name: string;
  };
}

interface Sale {
  id: number;
  billDate: string;
  grandTotal: string | number;
  status: string;
  customer?: {
    id: number;
    name: string;
  } | null;
  details?: {
    id: number;
    quantity: number;
    product: {
      id: number;
      name: string;
    };
  }[];
}

interface Customer {
  id: number;
  name: string;
  isActive: boolean;
}

interface InventoryItem {
  id: number;
  batchNumber: string;
  quantity: number;
  expiryDate: string | null;
  product: {
    id: number;
    name: string;
    sku: string;
  };
  warehouse: {
    id: number;
    name: string;
  };
}

interface PeriodReport {
  period: string;
  bills: number;
  revenue: string | number;
}

type ReportPeriod = "daily" | "weekly" | "monthly" | "yearly";

const Dashboard = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const [periodReport, setPeriodReport] = useState<PeriodReport[]>([]);
  const [reportPeriod, setReportPeriod] =
    useState<ReportPeriod>("monthly");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const role = user?.role;

  const canViewProducts =
    role === "Manager" || role === "Inventory Staff";

  const canViewInventory =
    role === "Manager" || role === "Inventory Staff";

  const canViewSales =
    role === "Manager" ||
    role === "Sales Executive" ||
    role === "Accountant";

  const canViewCustomers =
    role === "Manager" || role === "Sales Executive";

  // =========================
  // FETCH DASHBOARD DATA
  // =========================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        if (role === "Manager") {
          const [
            productsResponse,
            salesResponse,
            customersResponse,
            inventoryResponse,
            reportResponse,
          ] = await Promise.all([
            api.get("/products"),
            api.get("/sales"),
            api.get("/customers"),
            api.get("/inventory"),
            getSalesPeriodReport(reportPeriod),
          ]);

          setProducts(productsResponse.data);
          setSales(salesResponse.data);
          setCustomers(customersResponse.data);
          setInventory(inventoryResponse.data);

          setPeriodReport(
            (reportResponse.data || []).map((item) => ({
              period: item.period,
              bills: Number(item.bills || 0),
              revenue: Number(item.revenue || 0),
            }))
          );
        } else if (role === "Inventory Staff") {
          const [
            productsResponse,
            inventoryResponse,
          ] = await Promise.all([
            api.get("/products"),
            api.get("/inventory"),
          ]);

          setProducts(productsResponse.data);
          setInventory(inventoryResponse.data);
          setSales([]);
          setCustomers([]);
          setPeriodReport([]);
        } else if (role === "Sales Executive") {
          const [
            salesResponse,
            customersResponse,
            reportResponse,
          ] = await Promise.all([
            api.get("/sales"),
            api.get("/customers"),
            getSalesPeriodReport(reportPeriod),
          ]);

          setSales(salesResponse.data);
          setCustomers(customersResponse.data);
          setProducts([]);
          setInventory([]);

          setPeriodReport(
            (reportResponse.data || []).map((item) => ({
              period: item.period,
              bills: Number(item.bills || 0),
              revenue: Number(item.revenue || 0),
            }))
          );
        } else if (role === "Accountant") {
          const [
            salesResponse,
            reportResponse,
          ] = await Promise.all([
            api.get("/sales"),
            getSalesPeriodReport(reportPeriod),
          ]);

          setSales(salesResponse.data);
          setProducts([]);
          setCustomers([]);
          setInventory([]);

          setPeriodReport(
            (reportResponse.data || []).map((item) => ({
              period: item.period,
              bills: Number(item.bills || 0),
              revenue: Number(item.revenue || 0),
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);

        setError(
          "Unable to load dashboard data. Please make sure the server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    if (role) {
      fetchDashboardData();
    }
  }, [role, reportPeriod]);

  // =========================
  // TOTAL SALES
  // =========================

  const totalSales = useMemo(() => {
    return sales.reduce(
      (total, sale) => total + Number(sale.grandTotal || 0),
      0
    );
  }, [sales]);

  // =========================
  // TOTAL INVENTORY
  // =========================

  const totalInventoryUnits = useMemo(() => {
    return inventory.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );
  }, [inventory]);

  // =========================
  // LOW STOCK
  // =========================

  const lowStockProducts = useMemo(() => {
    const productStock = new Map<number, number>();

    inventory.forEach((item) => {
      const current = productStock.get(item.product.id) || 0;

      productStock.set(
        item.product.id,
        current + Number(item.quantity || 0)
      );
    });

    return products
      .filter((product) => {
        const stock = productStock.get(product.id) || 0;

        return stock > 0 && stock <= 10;
      })
      .map((product) => ({
        ...product,
        stock: productStock.get(product.id) || 0,
      }));
  }, [products, inventory]);

  // =========================
  // OUT OF STOCK
  // =========================

  const outOfStockProducts = useMemo(() => {
    const productStock = new Map<number, number>();

    inventory.forEach((item) => {
      const current = productStock.get(item.product.id) || 0;

      productStock.set(
        item.product.id,
        current + Number(item.quantity || 0)
      );
    });

    return products.filter((product) => {
      const stock = productStock.get(product.id) || 0;

      return stock === 0;
    });
  }, [products, inventory]);

  // =========================
  // EXPIRED STOCK
  // =========================

  const expiredItems = useMemo(() => {
    const today = new Date();

    return inventory.filter((item) => {
      if (!item.expiryDate) return false;

      return (
        new Date(item.expiryDate) < today &&
        item.quantity > 0
      );
    });
  }, [inventory]);

  // =========================
  // RECENT SALES
  // =========================

  const recentSales = useMemo(() => {
    return [...sales]
      .sort(
        (a, b) =>
          new Date(b.billDate).getTime() -
          new Date(a.billDate).getTime()
      )
      .slice(0, 6);
  }, [sales]);

  // =========================
  // PERIOD REPORT TOTAL
  // =========================

  const periodRevenue = useMemo(() => {
    return periodReport.reduce(
      (total, item) => total + Number(item.revenue || 0),
      0
    );
  }, [periodReport]);

  // =========================
  // MAX PERIOD SALES
  // =========================

  const maxPeriodSales = useMemo(() => {
    return Math.max(
      ...periodReport.map((item) =>
        Number(item.revenue || 0)
      ),
      1
    );
  }, [periodReport]);

  // =========================
  // FORMAT PERIOD LABEL
  // =========================

  const formatPeriod = (period: string) => {
    const date = new Date(period);

    if (Number.isNaN(date.getTime())) {
      return period;
    }

    if (reportPeriod === "daily") {
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
    }

    if (reportPeriod === "weekly") {
      return `Week ${date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })}`;
    }

    if (reportPeriod === "monthly") {
      return date.toLocaleDateString("en-IN", {
        month: "short",
      });
    }

    return date.toLocaleDateString("en-IN", {
      year: "numeric",
    });
  };

  // =========================
  // INVENTORY STATUS
  // =========================

  const inventoryStatus = {
    healthy: inventory.filter(
      (item) => item.quantity > 10
    ).length,

    low: inventory.filter(
      (item) =>
        item.quantity > 0 &&
        item.quantity <= 10
    ).length,

    out: inventory.filter(
      (item) => item.quantity === 0
    ).length,

    expired: expiredItems.length,
  };

  // =========================
  // FORMAT CURRENCY
  // =========================

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="dashboard-spinner"></div>

          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <div className="dashboard-error-icon">
            !
          </div>

          <h2>Dashboard unavailable</h2>

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

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="dashboard-page">

      {/* ================= HEADER ================= */}

      <div className="dashboard-header">
        <div>
          <div className="dashboard-breadcrumb">
            Dashboard
          </div>

          <h1>
            Good day {user?.name ? user.name : ""}
          </h1>

          <p>
            Here's what's happening with your
            inventory today.
          </p>
        </div>

        <div className="dashboard-header-info">
          <div className="dashboard-date-icon">
            📅
          </div>

          <div>
            <span>Today</span>

            <strong>
              {new Date().toLocaleDateString(
                "en-IN",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                }
              )}
            </strong>
          </div>
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}

      <div className="dashboard-stats">

        {canViewProducts && (
          <div className="dashboard-stat-card">
            <div className="stat-card-top">
              <div className="stat-icon products-icon">
                📦
              </div>

              <span className="stat-label">
                PRODUCTS
              </span>
            </div>

            <div className="stat-value">
              {products.length}
            </div>

            <div className="stat-bottom">
              <span>
                {
                  products.filter(
                    (product) =>
                      product.isActive
                  ).length
                }{" "}
                active products
              </span>

              <span className="stat-arrow">
                →
              </span>
            </div>
          </div>
        )}

        {canViewSales && (
          <div className="dashboard-stat-card">
            <div className="stat-card-top">
              <div className="stat-icon sales-icon">
                ₹
              </div>

              <span className="stat-label">
                TOTAL SALES
              </span>
            </div>

            <div className="stat-value">
              {formatCurrency(totalSales)}
            </div>

            <div className="stat-bottom">
              <span>
                {sales.length} sales recorded
              </span>

              <span className="stat-arrow">
                →
              </span>
            </div>
          </div>
        )}

        {canViewCustomers && (
          <div className="dashboard-stat-card">
            <div className="stat-card-top">
              <div className="stat-icon customers-icon">
                👥
              </div>

              <span className="stat-label">
                CUSTOMERS
              </span>
            </div>

            <div className="stat-value">
              {customers.length}
            </div>

            <div className="stat-bottom">
              <span>
                {
                  customers.filter(
                    (customer) =>
                      customer.isActive
                  ).length
                }{" "}
                active customers
              </span>

              <span className="stat-arrow">
                →
              </span>
            </div>
          </div>
        )}

        {canViewInventory && (
          <div className="dashboard-stat-card">
            <div className="stat-card-top">
              <div className="stat-icon warning-icon">
                ⚠
              </div>

              <span className="stat-label">
                STOCK ALERTS
              </span>
            </div>

            <div className="stat-value">
              {lowStockProducts.length +
                outOfStockProducts.length}
            </div>

            <div className="stat-bottom">
              <span>
                {outOfStockProducts.length} out of
                stock
              </span>

              <span className="stat-arrow">
                →
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ================= SALES + INVENTORY ================= */}

      <div className="dashboard-main-grid">

        {canViewSales && (
          <div className="dashboard-card sales-overview-card">

            <div className="card-header">
              <div>
                <h2>Sales Overview</h2>

                <p>
                  {reportPeriod.charAt(0).toUpperCase() +
                    reportPeriod.slice(1)}{" "}
                  sales report
                </p>
              </div>

              <div className="card-header-value">
                <span>Total Revenue</span>

                <strong>
                  {formatCurrency(
                    periodRevenue
                  )}
                </strong>
              </div>
            </div>

            {/* ================= PERIOD BUTTONS ================= */}

            <div className="sales-period-buttons">
              <button
                className={
                  reportPeriod === "daily"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setReportPeriod("daily")
                }
              >
                Daily
              </button>

              <button
                className={
                  reportPeriod === "weekly"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setReportPeriod("weekly")
                }
              >
                Weekly
              </button>

              <button
                className={
                  reportPeriod === "monthly"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setReportPeriod("monthly")
                }
              >
                Monthly
              </button>

              <button
                className={
                  reportPeriod === "yearly"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setReportPeriod("yearly")
                }
              >
                Yearly
              </button>
            </div>

            {/* ================= SALES CHART ================= */}

            <div className="sales-chart">

              <div className="chart-y-axis">
                <span>
                  {formatCurrency(
                    maxPeriodSales
                  )}
                </span>

                <span>
                  {formatCurrency(
                    maxPeriodSales / 2
                  )}
                </span>

                <span>₹0</span>
              </div>

              <div className="chart-area">

                <div className="chart-grid-line line-one"></div>

                <div className="chart-grid-line line-two"></div>

                <div className="chart-grid-line line-three"></div>

                <div className="chart-bars">

                  {periodReport.length > 0 ? (
                    periodReport.map(
                      (item, index) => {
                        const value =
                          Number(
                            item.revenue || 0
                          );

                        const height =
                          value === 0
                            ? 4
                            : Math.max(
                                (value /
                                  maxPeriodSales) *
                                  100,
                                8
                              );

                        return (
                          <div
                            className="chart-bar-wrapper"
                            key={`${item.period}-${index}`}
                          >
                            <div
                              className="chart-bar"
                              style={{
                                height: `${height}%`,
                              }}
                              title={`${formatPeriod(
                                item.period
                              )}: ${formatCurrency(
                                value
                              )}`}
                            >
                              {value > 0 && (
                                <span className="chart-tooltip">
                                  {formatCurrency(
                                    value
                                  )}
                                </span>
                              )}
                            </div>

                            <span className="chart-month">
                              {formatPeriod(
                                item.period
                              )}
                            </span>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <div className="no-sales-data">
                      No sales data available
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= INVENTORY OVERVIEW ================= */}

        {canViewInventory && (
          <div className="dashboard-card">

            <div className="card-header">
              <div>
                <h2>Inventory Overview</h2>

                <p>
                  Current inventory status
                </p>
              </div>

              <div className="card-header-value">
                <span>Total Units</span>

                <strong>
                  {totalInventoryUnits}
                </strong>
              </div>
            </div>

            <div className="inventory-status-list">

              <div className="inventory-status-item">
                <span>Healthy Stock</span>

                <strong>
                  {inventoryStatus.healthy}
                </strong>
              </div>

              <div className="inventory-status-item">
                <span>Low Stock</span>

                <strong>
                  {inventoryStatus.low}
                </strong>
              </div>

              <div className="inventory-status-item">
                <span>Out of Stock</span>

                <strong>
                  {inventoryStatus.out}
                </strong>
              </div>

              <div className="inventory-status-item">
                <span>Expired</span>

                <strong>
                  {inventoryStatus.expired}
                </strong>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ================= RECENT SALES ================= */}

      {canViewSales && (
        <div className="dashboard-card dashboard-full-card">

          <div className="card-header">
            <div>
              <h2>Recent Sales</h2>

              <p>
                Latest sales transactions
              </p>
            </div>
          </div>

          {recentSales.length === 0 ? (
            <div className="dashboard-empty">
              No sales available.
            </div>
          ) : (
            <div className="dashboard-table-wrapper">

              <table className="dashboard-table">

                <thead>
                  <tr>
                    <th>Bill ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {recentSales.map((sale) => (
                    <tr key={sale.id}>
                      <td>#{sale.id}</td>

                      <td>
                        {formatDate(
                          sale.billDate
                        )}
                      </td>

                      <td>
                        {sale.customer?.name ||
                          "Walk-in Customer"}
                      </td>

                      <td>
                        {sale.status}
                      </td>

                      <td>
                        {formatCurrency(
                          Number(
                            sale.grandTotal || 0
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}
        </div>
      )}

      {/* ================= STOCK ALERTS ================= */}

      {canViewInventory && (
        <div className="dashboard-card dashboard-full-card">

          <div className="card-header">
            <div>
              <h2>Stock Alerts</h2>

              <p>
                Products that require attention
              </p>
            </div>
          </div>

          {lowStockProducts.length === 0 &&
          outOfStockProducts.length === 0 &&
          expiredItems.length === 0 ? (
            <div className="dashboard-empty">
              No stock alerts. Inventory is in good
              condition.
            </div>
          ) : (
            <div className="stock-alert-list">

              {outOfStockProducts.map(
                (product) => (
                  <div
                    className="stock-alert-item"
                    key={`out-${product.id}`}
                  >
                    <div>
                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        SKU: {product.sku}
                      </span>
                    </div>

                    <span>
                      Out of Stock
                    </span>
                  </div>
                )
              )}

              {lowStockProducts.map(
                (product) => (
                  <div
                    className="stock-alert-item"
                    key={`low-${product.id}`}
                  >
                    <div>
                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        SKU: {product.sku}
                      </span>
                    </div>

                    <span>
                      {product.stock} units left
                    </span>
                  </div>
                )
              )}

              {expiredItems.slice(0, 6).map(
                (item) => (
                  <div
                    className="stock-alert-item"
                    key={`expired-${item.id}`}
                  >
                    <div>
                      <strong>
                        {item.product.name}
                      </strong>

                      <span>
                        Batch: {item.batchNumber}
                      </span>
                    </div>

                    <span>
                      Expired
                    </span>
                  </div>
                )
              )}

            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Dashboard;
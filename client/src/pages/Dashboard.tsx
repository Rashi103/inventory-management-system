
import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";
import api from "../services/axios";
import { useAuth } from "../context/AuthContext";

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

const Dashboard = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

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
          ] = await Promise.all([
            api.get("/products"),
            api.get("/sales"),
            api.get("/customers"),
            api.get("/inventory"),
          ]);

          setProducts(productsResponse.data);
          setSales(salesResponse.data);
          setCustomers(customersResponse.data);
          setInventory(inventoryResponse.data);
        } else if (role === "Inventory Staff") {
          const [productsResponse, inventoryResponse] =
            await Promise.all([
              api.get("/products"),
              api.get("/inventory"),
            ]);

          setProducts(productsResponse.data);
          setInventory(inventoryResponse.data);
          setSales([]);
          setCustomers([]);
        } else if (role === "Sales Executive") {
          const [salesResponse, customersResponse] =
            await Promise.all([
              api.get("/sales"),
              api.get("/customers"),
            ]);

          setSales(salesResponse.data);
          setCustomers(customersResponse.data);
          setProducts([]);
          setInventory([]);
        } else if (role === "Accountant") {
          const salesResponse = await api.get("/sales");

          setSales(salesResponse.data);
          setProducts([]);
          setCustomers([]);
          setInventory([]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);

        setError(
          "Unable to load dashboard data. Please make sure the server is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (role) {
      fetchDashboardData();
    }
  }, [role]);

  // =========================
  // TOTAL SALES
  // =========================

  const totalSales = useMemo(() => {
    return sales.reduce(
      (total, sale) => total + Number(sale.grandTotal || 0),
      0,
    );
  }, [sales]);

  // =========================
  // TOTAL INVENTORY
  // =========================

  const totalInventoryUnits = useMemo(() => {
    return inventory.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
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
        current + Number(item.quantity || 0),
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
        current + Number(item.quantity || 0),
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
          new Date(a.billDate).getTime(),
      )
      .slice(0, 6);
  }, [sales]);

  // =========================
  // SALES BY MONTH
  // =========================

  const monthlySales = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const currentYear = new Date().getFullYear();

    const salesByMonth = months.map((month, index) => ({
      month,
      value: 0,
      monthIndex: index,
    }));

    sales.forEach((sale) => {
      const date = new Date(sale.billDate);

      if (date.getFullYear() === currentYear) {
        salesByMonth[date.getMonth()].value += Number(
          sale.grandTotal || 0,
        );
      }
    });

    return salesByMonth;
  }, [sales]);

  const maxMonthlySales = Math.max(
    ...monthlySales.map((item) => item.value),
    1,
  );

  // =========================
  // INVENTORY STATUS
  // =========================

  const inventoryStatus = {
    healthy: inventory.filter((item) => item.quantity > 10).length,

    low: inventory.filter(
      (item) => item.quantity > 0 && item.quantity <= 10,
    ).length,

    out: inventory.filter((item) => item.quantity === 0).length,

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
          <div className="dashboard-error-icon">!</div>

          <h2>Dashboard unavailable</h2>

          <p>{error}</p>

          <button onClick={() => window.location.reload()}>
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
          <div className="dashboard-breadcrumb">Dashboard</div>

          <h1>Good day 👋</h1>

          <p>
            Here's what's happening with your inventory today.
          </p>
        </div>

        <div className="dashboard-header-info">
          <div className="dashboard-date-icon">📅</div>

          <div>
            <span>Today</span>

            <strong>
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </strong>
          </div>
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}

      <div className="dashboard-stats">
        {canViewProducts && (
          <div className="dashboard-stat-card">
            <div className="stat-card-top">
              <div className="stat-icon products-icon">📦</div>
              <span className="stat-label">PRODUCTS</span>
            </div>

            <div className="stat-value">{products.length}</div>

            <div className="stat-bottom">
              <span>
                {
                  products.filter(
                    (product) => product.isActive,
                  ).length
                }{" "}
                active products
              </span>

              <span className="stat-arrow">→</span>
            </div>
          </div>
        )}

        {canViewSales && (
          <div className="dashboard-stat-card">
            <div className="stat-card-top">
              <div className="stat-icon sales-icon">₹</div>
              <span className="stat-label">TOTAL SALES</span>
            </div>

            <div className="stat-value">
              {formatCurrency(totalSales)}
            </div>

            <div className="stat-bottom">
              <span>{sales.length} sales recorded</span>

              <span className="stat-arrow">→</span>
            </div>
          </div>
        )}

        {canViewCustomers && (
          <div className="dashboard-stat-card">
            <div className="stat-card-top">
              <div className="stat-icon customers-icon">👥</div>
              <span className="stat-label">CUSTOMERS</span>
            </div>

            <div className="stat-value">{customers.length}</div>

            <div className="stat-bottom">
              <span>
                {
                  customers.filter(
                    (customer) => customer.isActive,
                  ).length
                }{" "}
                active customers
              </span>

              <span className="stat-arrow">→</span>
            </div>
          </div>
        )}

        {canViewInventory && (
          <div className="dashboard-stat-card">
            <div className="stat-card-top">
              <div className="stat-icon warning-icon">⚠</div>
              <span className="stat-label">STOCK ALERTS</span>
            </div>

            <div className="stat-value">
              {lowStockProducts.length +
                outOfStockProducts.length}
            </div>

            <div className="stat-bottom">
              <span>
                {outOfStockProducts.length} out of stock
              </span>

              <span className="stat-arrow">→</span>
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
                  Monthly sales for {new Date().getFullYear()}
                </p>
              </div>

              <div className="card-header-value">
                <span>Total Revenue</span>

                <strong>
                  {formatCurrency(totalSales)}
                </strong>
              </div>
            </div>

            <div className="sales-chart">
              <div className="chart-y-axis">
                <span>
                  {formatCurrency(maxMonthlySales)}
                </span>

                <span>
                  {formatCurrency(maxMonthlySales / 2)}
                </span>

                <span>₹0</span>
              </div>

              <div className="chart-area">
                <div className="chart-grid-line line-one"></div>
                <div className="chart-grid-line line-two"></div>
                <div className="chart-grid-line line-three"></div>

                <div className="chart-bars">
                  {monthlySales.map((item) => {
                    const height =
                      item.value === 0
                        ? 4
                        : Math.max(
                            (item.value /
                              maxMonthlySales) *
                              100,
                            8,
                          );

                    return (
                      <div
                        className="chart-bar-wrapper"
                        key={item.month}
                      >
                        <div
                          className="chart-bar"
                          style={{
                            height: `${height}%`,
                          }}
                          title={`${item.month}: ${formatCurrency(
                            item.value,
                          )}`}
                        >
                          {item.value > 0 && (
                            <span className="chart-tooltip">
                              {formatCurrency(item.value)}
                            </span>
                          )}
                        </div>

                        <span className="chart-month">
                          {item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {canViewInventory && (
          <div className="dashboard-card inventory-overview-card">
            <div className="card-header">
              <div>
                <h2>Inventory Overview</h2>
                <p>Current stock status</p>
              </div>

              <div className="inventory-total">
                <strong>{totalInventoryUnits}</strong>
                <span>units</span>
              </div>
            </div>

            <div className="inventory-status-list">
              <div className="inventory-status-item">
                <div className="inventory-status-name">
                  <span className="status-dot healthy"></span>
                  <span>Healthy Stock</span>
                </div>

                <strong>{inventoryStatus.healthy}</strong>
              </div>

              <div className="inventory-progress">
                <div
                  className="progress-healthy"
                  style={{
                    width: `${
                      inventory.length
                        ? (inventoryStatus.healthy /
                            inventory.length) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

              <div className="inventory-status-item">
                <div className="inventory-status-name">
                  <span className="status-dot low"></span>
                  <span>Low Stock</span>
                </div>

                <strong>{inventoryStatus.low}</strong>
              </div>

              <div className="inventory-progress">
                <div
                  className="progress-low"
                  style={{
                    width: `${
                      inventory.length
                        ? (inventoryStatus.low /
                            inventory.length) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

              <div className="inventory-status-item">
                <div className="inventory-status-name">
                  <span className="status-dot out"></span>
                  <span>Out of Stock</span>
                </div>

                <strong>{inventoryStatus.out}</strong>
              </div>

              <div className="inventory-progress">
                <div
                  className="progress-out"
                  style={{
                    width: `${
                      inventory.length
                        ? (inventoryStatus.out /
                            inventory.length) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>

              <div className="inventory-status-item">
                <div className="inventory-status-name">
                  <span className="status-dot expired"></span>
                  <span>Expired</span>
                </div>

                <strong>{inventoryStatus.expired}</strong>
              </div>

              <div className="inventory-progress">
                <div
                  className="progress-expired"
                  style={{
                    width: `${
                      inventory.length
                        ? (inventoryStatus.expired /
                            inventory.length) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= LOWER GRID ================= */}

      <div className="dashboard-lower-grid">
        {canViewSales && (
          <div className="dashboard-card recent-sales-card">
            <div className="card-header">
              <div>
                <h2>Recent Sales</h2>
                <p>Latest transactions</p>
              </div>

              <a href="/sales" className="view-all-link">
                View all →
              </a>
            </div>

            {recentSales.length === 0 ? (
              <div className="dashboard-empty">
                <span>🧾</span>
                <p>No sales recorded yet.</p>
              </div>
            ) : (
              <div className="sales-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Invoice</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentSales.map((sale) => (
                      <tr key={sale.id}>
                        <td>
                          <span className="invoice-number">
                            INV-
                            {String(sale.id).padStart(4, "0")}
                          </span>
                        </td>

                        <td>
                          <div className="customer-cell">
                            <div className="customer-avatar">
                              {sale.customer?.name
                                ? sale.customer.name
                                    .charAt(0)
                                    .toUpperCase()
                                : "W"}
                            </div>

                            <span>
                              {sale.customer?.name ||
                                "Walk-in Customer"}
                            </span>
                          </div>
                        </td>

                        <td>
                          {formatDate(sale.billDate)}
                        </td>

                        <td>
                          <strong>
                            {formatCurrency(
                              Number(sale.grandTotal),
                            )}
                          </strong>
                        </td>

                        <td>
                          <span className="sale-status">
                            {sale.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {canViewInventory && (
          <div className="dashboard-card stock-alert-card">
            <div className="card-header">
              <div>
                <h2>Stock Alerts</h2>
                <p>Products that need attention</p>
              </div>

              <a
                href="/inventory"
                className="view-all-link"
              >
                Inventory →
              </a>
            </div>

            <div className="stock-alert-list">
              {outOfStockProducts.length === 0 &&
              lowStockProducts.length === 0 &&
              expiredItems.length === 0 ? (
                <div className="no-alerts">
                  <div>✓</div>

                  <strong>Everything looks good</strong>

                  <span>
                    No stock alerts at the moment.
                  </span>
                </div>
              ) : (
                <>
                  {outOfStockProducts
                    .slice(0, 3)
                    .map((product) => (
                      <div
                        className="stock-alert-item"
                        key={`out-${product.id}`}
                      >
                        <div className="alert-icon out">
                          !
                        </div>

                        <div className="alert-product">
                          <strong>{product.name}</strong>
                          <span>{product.sku}</span>
                        </div>

                        <span className="alert-badge out">
                          Out of stock
                        </span>
                      </div>
                    ))}

                  {lowStockProducts
                    .slice(0, 3)
                    .map((product) => (
                      <div
                        className="stock-alert-item"
                        key={`low-${product.id}`}
                      >
                        <div className="alert-icon low">
                          !
                        </div>

                        <div className="alert-product">
                          <strong>{product.name}</strong>
                          <span>{product.sku}</span>
                        </div>

                        <span className="alert-badge low">
                          {product.stock} left
                        </span>
                      </div>
                    ))}

                  {expiredItems
                    .slice(0, 2)
                    .map((item) => (
                      <div
                        className="stock-alert-item"
                        key={`expired-${item.id}`}
                      >
                        <div className="alert-icon expired">
                          !
                        </div>

                        <div className="alert-product">
                          <strong>{item.product.name}</strong>

                          <span>
                            Batch {item.batchNumber}
                          </span>
                        </div>

                        <span className="alert-badge expired">
                          Expired
                        </span>
                      </div>
                    ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ================= QUICK SUMMARY ================= */}

      <div className="dashboard-summary-strip">
        {canViewInventory && (
          <>
            <div className="summary-item">
              <span className="summary-icon">📦</span>

              <div>
                <strong>{totalInventoryUnits}</strong>
                <span>Total Units</span>
              </div>
            </div>

            <div className="summary-divider"></div>
          </>
        )}

        {canViewSales && (
          <>
            <div className="summary-item">
              <span className="summary-icon">🧾</span>

              <div>
                <strong>{sales.length}</strong>
                <span>Total Bills</span>
              </div>
            </div>

            <div className="summary-divider"></div>
          </>
        )}

        {canViewCustomers && (
          <>
            <div className="summary-item">
              <span className="summary-icon">👥</span>

              <div>
                <strong>{customers.length}</strong>
                <span>Total Customers</span>
              </div>
            </div>

            <div className="summary-divider"></div>
          </>
        )}

        {canViewInventory && (
          <div className="summary-item">
            <span className="summary-icon">⚠</span>

            <div>
              <strong>{expiredItems.length}</strong>
              <span>Expired Batches</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


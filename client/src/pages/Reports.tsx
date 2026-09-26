import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Reports.css";

interface ProductPerformance {
  productId: number;
  productName: string;
  sku: string;
  quantitySold: number;
  revenue: number;
}

interface CustomerPerformance {
  customerId: number;
  customerName: string;
  totalBills: number;
  totalPurchases: number;
}

interface SalesBill {
  id: number;
  billDate: string;
  grandTotal: string | number;
  status: string;
}

const Reports = () => {
  const [productPerformance, setProductPerformance] = useState<
    ProductPerformance[]
  >([]);

  const [customerPerformance, setCustomerPerformance] = useState<
    CustomerPerformance[]
  >([]);

  const [sales, setSales] = useState<SalesBill[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH REPORT DATA
  // =========================

  const fetchReports = async () => {
    try {
      setLoading(true);

      const [
        productResponse,
        customerResponse,
        salesResponse,
      ] = await Promise.all([
        axios.get(
          "http://localhost:5000/api/sales-details/performance"
        ),
        axios.get(
          "http://localhost:5000/api/sales/performance/customers"
        ),
        axios.get(
          "http://localhost:5000/api/sales"
        ),
      ]);

      setProductPerformance(productResponse.data);
      setCustomerPerformance(customerResponse.data);
      setSales(salesResponse.data);

      setError("");
    } catch (error) {
      console.error("Error fetching reports:", error);

      setError(
        "Failed to load reports. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // =========================
  // SUMMARY
  // =========================

  const totalRevenue = sales.reduce(
    (total, sale) =>
      total + Number(sale.grandTotal || 0),
    0
  );

  const totalBills = sales.length;

  const totalItemsSold = productPerformance.reduce(
    (total, product) =>
      total + Number(product.quantitySold || 0),
    0
  );

  const averageBill =
    totalBills > 0
      ? totalRevenue / totalBills
      : 0;

  const topProduct = productPerformance[0];

  const topCustomer = customerPerformance[0];

  // =========================
  // MONTHLY SALES
  // =========================

  const monthlySales = useMemo(() => {
    const monthMap: Record<string, number> = {};

    sales.forEach((sale) => {
      const date = new Date(sale.billDate);

      const month = date.toLocaleDateString(
        "en-IN",
        {
          month: "short",
        }
      );

      monthMap[month] =
        (monthMap[month] || 0) +
        Number(sale.grandTotal || 0);
    });

    return Object.entries(monthMap).map(
      ([month, amount]) => ({
        month,
        amount,
      })
    );
  }, [sales]);

  const maxMonthlySales =
    monthlySales.length > 0
      ? Math.max(
          ...monthlySales.map(
            (item) => item.amount
          )
        )
      : 0;

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="reports-page">
        <div className="reports-loading">
          <div className="reports-spinner"></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="reports-page">
        <div className="reports-error">
          <div className="reports-error-icon">
            !
          </div>

          <h2>Reports unavailable</h2>

          <p>{error}</p>

          <button
            onClick={fetchReports}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">

      {/* HEADER */}

      <div className="reports-header">

        <div>
          <div className="reports-breadcrumb">
            Dashboard / Reports
          </div>

          <h1>Reports & Analytics</h1>

          <p>
            Analyze sales, products and customer
            purchasing performance.
          </p>
        </div>

      </div>

      {/* KPI CARDS */}

      <div className="reports-stats">

        <div className="report-stat-card">
          <div className="report-stat-icon purple">
            ₹
          </div>

          <div>
            <span>Total Revenue</span>

            <strong>
              ₹{totalRevenue.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon blue">
            🧾
          </div>

          <div>
            <span>Total Bills</span>

            <strong>{totalBills}</strong>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon green">
            📦
          </div>

          <div>
            <span>Items Sold</span>

            <strong>{totalItemsSold}</strong>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon orange">
            ↗
          </div>

          <div>
            <span>Average Bill</span>

            <strong>
              ₹{Math.round(
                averageBill
              ).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

      </div>

      {/* TOP PERFORMERS */}

      <div className="reports-highlight-grid">

        {/* TOP PRODUCT */}

        <div className="report-highlight-card">

          <div className="highlight-header">
            <div>
              <span className="highlight-label">
                TOP PRODUCT
              </span>

              <h2>Most Sold Product</h2>
            </div>

            <div className="highlight-icon purple">
              ★
            </div>
          </div>

          {topProduct ? (
            <div className="highlight-content">

              <div className="highlight-avatar">
                {topProduct.productName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="highlight-details">

                <strong>
                  {topProduct.productName}
                </strong>

                <span>
                  SKU: {topProduct.sku}
                </span>

              </div>

              <div className="highlight-value">

                <strong>
                  {topProduct.quantitySold}
                </strong>

                <span>
                  units sold
                </span>

              </div>

            </div>
          ) : (
            <div className="no-report-data">
              No product sales data available.
            </div>
          )}

        </div>

        {/* TOP CUSTOMER */}

        <div className="report-highlight-card">

          <div className="highlight-header">

            <div>
              <span className="highlight-label">
                TOP CUSTOMER
              </span>

              <h2>Highest Purchases</h2>
            </div>

            <div className="highlight-icon blue">
              ★
            </div>

          </div>

          {topCustomer ? (
            <div className="highlight-content">

              <div className="highlight-avatar customer">
                {topCustomer.customerName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="highlight-details">

                <strong>
                  {topCustomer.customerName}
                </strong>

                <span>
                  {topCustomer.totalBills} bills
                </span>

              </div>

              <div className="highlight-value">

                <strong>
                  ₹
                  {topCustomer.totalPurchases.toLocaleString(
                    "en-IN"
                  )}
                </strong>

                <span>
                  purchased
                </span>

              </div>

            </div>
          ) : (
            <div className="no-report-data">
              No customer sales data available.
            </div>
          )}

        </div>

      </div>

      {/* MAIN REPORT GRID */}

      <div className="reports-main-grid">

        {/* PRODUCT PERFORMANCE */}

        <div className="report-panel">

          <div className="report-panel-header">

            <div>
              <h2>Product Performance</h2>

              <p>
                Products ranked by quantity sold.
              </p>
            </div>

          </div>

          {productPerformance.length === 0 ? (
            <div className="no-report-data">
              No product performance data available.
            </div>
          ) : (
            <div className="performance-list">

              {productPerformance.map(
                (product, index) => (

                  <div
                    className="performance-row"
                    key={product.productId}
                  >

                    <div className="performance-rank">
                      {index + 1}
                    </div>

                    <div className="performance-product">

                      <strong>
                        {product.productName}
                      </strong>

                      <span>
                        {product.sku}
                      </span>

                    </div>

                    <div className="performance-bar-area">

                      <div className="performance-bar-track">

                        <div
                          className="performance-bar"
                          style={{
                            width: `${
                              topProduct
                                ? (product.quantitySold /
                                    topProduct.quantitySold) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>

                      </div>

                    </div>

                    <div className="performance-number">

                      <strong>
                        {product.quantitySold}
                      </strong>

                      <span>units</span>

                    </div>

                    <div className="performance-revenue">

                      ₹
                      {product.revenue.toLocaleString(
                        "en-IN"
                      )}

                    </div>

                  </div>

                )
              )}

            </div>
          )}

        </div>

        {/* CUSTOMER PERFORMANCE */}

        <div className="report-panel">

          <div className="report-panel-header">

            <div>
              <h2>Customer Performance</h2>

              <p>
                Customers ranked by total purchases.
              </p>
            </div>

          </div>

          {customerPerformance.length === 0 ? (
            <div className="no-report-data">
              No customer performance data available.
            </div>
          ) : (
            <div className="customer-performance-list">

              {customerPerformance.map(
                (customer, index) => (

                  <div
                    className="customer-performance-row"
                    key={customer.customerId}
                  >

                    <div className="customer-rank">
                      {index + 1}
                    </div>

                    <div className="customer-report-avatar">
                      {customer.customerName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="customer-report-details">

                      <strong>
                        {customer.customerName}
                      </strong>

                      <span>
                        {customer.totalBills} bills
                      </span>

                    </div>

                    <div className="customer-report-amount">

                      <strong>
                        ₹
                        {customer.totalPurchases.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <span>
                        purchases
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>
          )}

        </div>

      </div>

      {/* MONTHLY SALES */}

      <div className="report-panel monthly-panel">

        <div className="report-panel-header">

          <div>
            <h2>Sales Overview</h2>

            <p>
              Sales revenue grouped by month.
            </p>
          </div>

          <div className="monthly-total">
            <span>Total</span>

            <strong>
              ₹{totalRevenue.toLocaleString("en-IN")}
            </strong>
          </div>

        </div>

        {monthlySales.length === 0 ? (
          <div className="no-report-data">
            No monthly sales data available.
          </div>
        ) : (
          <div className="monthly-chart">

            {monthlySales.map(
              (item) => {

                const height =
                  maxMonthlySales > 0
                    ? Math.max(
                        (item.amount /
                          maxMonthlySales) *
                          100,
                        8
                      )
                    : 8;

                return (
                  <div
                    className="monthly-column"
                    key={item.month}
                  >

                    <div className="monthly-value">
                      ₹
                      {item.amount.toLocaleString(
                        "en-IN"
                      )}
                    </div>

                    <div className="monthly-bar-wrapper">

                      <div
                        className="monthly-bar"
                        style={{
                          height: `${height}%`,
                        }}
                      ></div>

                    </div>

                    <span>
                      {item.month}
                    </span>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* REPORT INFO */}

      <div className="reports-info-strip">

        <div className="reports-info-icon">
          📊
        </div>

        <div>

          <strong>
            Report Information
          </strong>

          <p>
            Product performance is based on quantity
            sold, while customer performance is based
            on total purchase value.
          </p>

        </div>

        <div className="reports-info-summary">

          <span>
            Products Tracked
          </span>

          <strong>
            {productPerformance.length}
          </strong>

        </div>

      </div>

    </div>
  );
};

export default Reports;


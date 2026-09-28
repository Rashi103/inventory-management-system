import { useEffect, useState } from "react";
import api from "../services/axios";
import "./Reports.css";
import { getSalesPeriodReport } from "../services/reportServices";

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

interface PeriodReport {
  period: string;
  bills: number;
  revenue: string | number;
}

const Reports = () => {
  const [productPerformance, setProductPerformance] = useState<
    ProductPerformance[]
  >([]);

  const [customerPerformance, setCustomerPerformance] = useState<
    CustomerPerformance[]
  >([]);

  const [sales, setSales] = useState<SalesBill[]>([]);

  const [reportPeriod, setReportPeriod] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("monthly");

  const [periodReport, setPeriodReport] = useState<PeriodReport[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH REPORT DATA
  // =========================

  const fetchReports = async () => {
    console.log("CURRENT REPORT PERIOD:", reportPeriod);
    try {
      setLoading(true);
      setError("");

      const [productResponse, customerResponse, salesResponse, reportResponse] =
        await Promise.all([
          api.get("/sales-details/performance"),
          api.get("/sales/performance/customers"),
          api.get("/sales"),
          getSalesPeriodReport(reportPeriod),
        ]);

      const products: ProductPerformance[] = (productResponse.data || []).map(
        (product: any) => ({
          productId: Number(product.productId || 0),
          productName: String(product.productName || "Unknown Product"),
          sku: String(product.sku || "N/A"),
          quantitySold: Number(product.quantitySold || 0),
          revenue: Number(product.revenue || 0),
        }),
      );

      const customers: CustomerPerformance[] = (
        customerResponse.data || []
      ).map((customer: any) => ({
        customerId: Number(customer.customerId || 0),
        customerName: String(customer.customerName || "Unknown Customer"),
        totalBills: Number(customer.totalBills || 0),
        totalPurchases: Number(customer.totalPurchases || 0),
      }));

      const salesData: SalesBill[] = (salesResponse.data || []).map(
        (sale: any) => ({
          id: Number(sale.id || 0),
          billDate: sale.billDate,
          grandTotal: sale.grandTotal || 0,
          status: String(sale.status || ""),
        }),
      );
      console.log("REPORT API RESPONSE:", reportResponse.data);

      const periodData: PeriodReport[] = (reportResponse.data || []).map(
        (item: any) => ({
          period: item.period,
          bills: Number(item.bills || 0),
          revenue: Number(item.revenue || 0),
        }),
      );

      console.log("PERIOD REPORT:", periodData);
      console.log("REPORT DATA:", reportResponse.data);
      setProductPerformance(products);
      setCustomerPerformance(customers);
      setSales(salesData);
      setPeriodReport(periodData);
    } catch (error) {
      console.error("Error fetching reports:", error);

      setError(
        "Failed to load reports. Please make sure the server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [reportPeriod]);

  // =========================
  // SUMMARY
  // =========================

  const totalRevenue = sales.reduce(
    (total, sale) => total + Number(sale.grandTotal || 0),
    0,
  );

  const totalBills = sales.length;

  const totalItemsSold = productPerformance.reduce(
    (total, product) => total + Number(product.quantitySold || 0),
    0,
  );

  const averageBill = totalBills > 0 ? totalRevenue / totalBills : 0;

  const topProduct = productPerformance[0];

  const topCustomer = customerPerformance[0];

  // =========================
  // PERIOD REPORT SUMMARY
  // =========================

  const periodRevenue = periodReport.reduce(
    (total, item) => total + Number(item.revenue || 0),
    0,
  );

  const maxPeriodSales =
    periodReport.length > 0
      ? Math.max(...periodReport.map((item) => Number(item.revenue || 0)))
      : 0;

  const getPeriodLabel = () => {
    switch (reportPeriod) {
      case "daily":
        return "Day";

      case "weekly":
        return "Week";

      case "monthly":
        return "Month";

      case "yearly":
        return "Year";

      default:
        return "Period";
    }
  };

  const formatPeriod = (value: string) => {
    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return value;
    }

    if (reportPeriod === "daily") {
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
    }

    if (reportPeriod === "weekly") {
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
    }

    if (reportPeriod === "monthly") {
      return date.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });
    }

    return date.toLocaleDateString("en-IN", {
      year: "numeric",
    });
  };

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
          <div className="reports-error-icon">!</div>

          <h2>Reports unavailable</h2>

          <p>{error}</p>

          <button onClick={fetchReports}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      {/* HEADER */}

      <div className="reports-header">
        <div>
          <div className="reports-breadcrumb">Dashboard / Reports</div>

          <h1>Reports & Analytics</h1>

          <p>Analyze sales, products and customer purchasing performance.</p>
        </div>
      </div>

      {/* KPI CARDS */}

      <div className="reports-stats">
        <div className="report-stat-card">
          <div className="report-stat-icon purple">₹</div>

          <div>
            <span>Total Revenue</span>

            <strong>₹{totalRevenue.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon blue">🧾</div>

          <div>
            <span>Total Bills</span>

            <strong>{totalBills}</strong>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon green">📦</div>

          <div>
            <span>Items Sold</span>

            <strong>{totalItemsSold}</strong>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon orange">↗</div>

          <div>
            <span>Average Bill</span>

            <strong>₹{Math.round(averageBill).toLocaleString("en-IN")}</strong>
          </div>
        </div>
      </div>

      {/* TOP PERFORMERS */}

      <div className="reports-highlight-grid">
        {/* TOP PRODUCT */}

        <div className="report-highlight-card">
          <div className="highlight-header">
            <div>
              <span className="highlight-label">TOP PRODUCT</span>

              <h2>Most Sold Product</h2>
            </div>

            <div className="highlight-icon purple">★</div>
          </div>

          {topProduct ? (
            <div className="highlight-content">
              <div className="highlight-avatar">
                {String(topProduct.productName || "P")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="highlight-details">
                <strong>
                  {String(topProduct.productName || "Unknown Product")}
                </strong>

                <span>SKU: {String(topProduct.sku || "N/A")}</span>
              </div>

              <div className="highlight-value">
                <strong>{Number(topProduct.quantitySold || 0)}</strong>

                <span>units sold</span>
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
              <span className="highlight-label">TOP CUSTOMER</span>

              <h2>Highest Purchases</h2>
            </div>

            <div className="highlight-icon blue">★</div>
          </div>

          {topCustomer ? (
            <div className="highlight-content">
              <div className="highlight-avatar customer">
                {String(topCustomer.customerName || "C")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="highlight-details">
                <strong>
                  {String(topCustomer.customerName || "Unknown Customer")}
                </strong>

                <span>{Number(topCustomer.totalBills || 0)} bills</span>
              </div>

              <div className="highlight-value">
                <strong>
                  ₹
                  {Number(topCustomer.totalPurchases || 0).toLocaleString(
                    "en-IN",
                  )}
                </strong>

                <span>purchased</span>
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

              <p>Products ranked by quantity sold.</p>
            </div>
          </div>

          {productPerformance.length === 0 ? (
            <div className="no-report-data">
              No product performance data available.
            </div>
          ) : (
            <div className="performance-list">
              {productPerformance.map((product, index) => {
                const quantitySold = Number(product.quantitySold || 0);

                const topQuantity = Number(topProduct?.quantitySold || 0);

                const performanceWidth =
                  topQuantity > 0
                    ? Math.min((quantitySold / topQuantity) * 100, 100)
                    : 0;

                return (
                  <div className="performance-row" key={product.productId}>
                    <div className="performance-rank">{index + 1}</div>

                    <div className="performance-product">
                      <strong>
                        {String(product.productName || "Unknown Product")}
                      </strong>

                      <span>{String(product.sku || "N/A")}</span>
                    </div>

                    <div className="performance-bar-area">
                      <div className="performance-bar-track">
                        <div
                          className="performance-bar"
                          style={{
                            width: `${performanceWidth}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="performance-number">
                      <strong>{quantitySold}</strong>

                      <span>units</span>
                    </div>

                    <div className="performance-revenue">
                      ₹ {Number(product.revenue || 0).toLocaleString("en-IN")}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CUSTOMER PERFORMANCE */}

        <div className="report-panel">
          <div className="report-panel-header">
            <div>
              <h2>Customer Performance</h2>

              <p>Customers ranked by total purchases.</p>
            </div>
          </div>

          {customerPerformance.length === 0 ? (
            <div className="no-report-data">
              No customer performance data available.
            </div>
          ) : (
            <div className="customer-performance-list">
              {customerPerformance.map((customer, index) => (
                <div
                  className="customer-performance-row"
                  key={customer.customerId}
                >
                  <div className="customer-rank">{index + 1}</div>

                  <div className="customer-report-avatar">
                    {String(customer.customerName || "C")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="customer-report-details">
                    <strong>
                      {String(customer.customerName || "Unknown Customer")}
                    </strong>

                    <span>{Number(customer.totalBills || 0)} bills</span>
                  </div>

                  <div className="customer-report-amount">
                    <strong>
                      ₹
                      {Number(customer.totalPurchases || 0).toLocaleString(
                        "en-IN",
                      )}
                    </strong>

                    <span>purchases</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SALES OVERVIEW */}

      <div className="report-panel monthly-panel">
        <div className="report-panel-header">
          <div>
            <h2>Sales Overview</h2>

            <p>Sales revenue grouped by {getPeriodLabel().toLowerCase()}.</p>
          </div>

          <div className="monthly-total">
            <span>Total</span>

            <strong>₹{periodRevenue.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        {/* PERIOD SELECTOR */}

        <div className="report-period-selector">
          <button
            className={reportPeriod === "daily" ? "active" : ""}
            onClick={() => setReportPeriod("daily")}
          >
            Daily
          </button>

          <button
            className={reportPeriod === "weekly" ? "active" : ""}
            onClick={() => setReportPeriod("weekly")}
          >
            Weekly
          </button>

          <button
            className={reportPeriod === "monthly" ? "active" : ""}
            onClick={() => setReportPeriod("monthly")}
          >
            Monthly
          </button>

          <button
            className={reportPeriod === "yearly" ? "active" : ""}
            onClick={() => setReportPeriod("yearly")}
          >
            Yearly
          </button>
        </div>

        {periodReport.length === 0 ? (
          <div className="no-report-data">
            No {getPeriodLabel().toLowerCase()} sales data available.
          </div>
        ) : (
          <div className="monthly-chart">
            {periodReport.map((item, index) => {
              const amount = Number(item.revenue || 0);

              const height =
                maxPeriodSales > 0
                  ? Math.max((amount / maxPeriodSales) * 100, 8)
                  : 8;

              return (
                <div className="monthly-column" key={`${item.period}-${index}`}>
                  <div className="monthly-value">
                    ₹{amount.toLocaleString("en-IN")}
                  </div>

                  <div className="monthly-bar-wrapper">
                    <div
                      className="monthly-bar"
                      style={{
                        height: `${height}%`,
                      }}
                    ></div>
                  </div>

                  <span>{formatPeriod(item.period)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* REPORT INFO */}

      <div className="reports-info-strip">
        <div className="reports-info-icon">📊</div>

        <div>
          <strong>Report Information</strong>

          <p>
            Product performance is based on quantity sold, while customer
            performance is based on total purchase value.
          </p>
        </div>

        <div className="reports-info-summary">
          <span>Products Tracked</span>

          <strong>{productPerformance.length}</strong>
        </div>
      </div>
    </div>
  );
};

export default Reports;

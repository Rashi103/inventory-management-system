import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Sales.css";
interface Product {
  id: number;
  name: string;
  sku: string;
}
interface SalesDetail {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: string | number;
  discount: string | number;
  totalPrice: string | number;
  product: Product;
}
interface Payment {
  id: number;
  amount: string | number;
  paymentMethod: string;
  paymentDate: string;
  status: string;
}
interface Customer {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
}
interface SalesBill {
  id: number;
  customerId: number | null;
  billDate: string;
  subtotal: string | number;
  taxAmount: string | number;
  discount: string | number;
  grandTotal: string | number;
  status: string;
  customer: Customer | null;
  details: SalesDetail[];
  payments: Payment[];
}
const Sales = () => {
  const [sales, setSales] = useState<SalesBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [expandedSale, setExpandedSale] = useState<number | null>(null);
  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/sales");
      setSales(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching sales:", error);
      setError("Failed to load sales. Please make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSales();
  }, []);
  const getPaymentTotal = (sale: SalesBill) => {
    return (sale.payments || []).reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0,
    );
  };
  const getPaymentStatus = (sale: SalesBill) => {
    const paid = getPaymentTotal(sale);
    const total = Number(sale.grandTotal || 0);
    if (paid >= total && total > 0) {
      return "Paid";
    }
    if (paid > 0) {
      return "Partial";
    }
    return "Unpaid";
  };
  const filteredSales = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    return sales.filter((sale) => {
      const invoiceNumber = `INV-2026-${String(sale.id).padStart(3, "0")}`;
      const customerName = sale.customer?.name || "Walk-in Customer";
      const matchesSearch =
        !search ||
        invoiceNumber.toLowerCase().includes(search) ||
        customerName.toLowerCase().includes(search);
      const matchesStatus =
        statusFilter === "all" ||
        sale.status.toLowerCase() === statusFilter.toLowerCase();
      const paymentStatus = getPaymentStatus(sale);
      const matchesPayment =
        paymentFilter === "all" ||
        paymentStatus.toLowerCase() === paymentFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [sales, searchTerm, statusFilter, paymentFilter]);
  const totalSales = sales.reduce(
    (total, sale) => total + Number(sale.grandTotal || 0),
    0,
  );
  const totalBills = sales.length;
  const averageBill = totalBills > 0 ? totalSales / totalBills : 0;
  const totalPaid = sales.reduce(
    (total, sale) => total + getPaymentTotal(sale),
    0,
  );
  const totalItemsSold = sales.reduce(
    (total, sale) =>
      total +
      (sale.details || []).reduce(
        (sum, detail) => sum + Number(detail.quantity || 0),
        0,
      ),
    0,
  );
  const paidBills = sales.filter(
    (sale) => getPaymentStatus(sale) === "Paid",
  ).length;
  const partialBills = sales.filter(
    (sale) => getPaymentStatus(sale) === "Partial",
  ).length;
  const unpaidBills = sales.filter(
    (sale) => getPaymentStatus(sale) === "Unpaid",
  ).length;
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const getPaymentClass = (status: string) => {
    switch (status) {
      case "Paid":
        return "paid";
      case "Partial":
        return "partial";
      case "Unpaid":
        return "unpaid";
      default:
        return "unknown";
    }
  };
  const toggleSale = (id: number) => {
    setExpandedSale(expandedSale === id ? null : id);
  };
  if (loading) {
    return (
      <div className="sales-page">
        {" "}
        <div className="sales-loading">
          {" "}
          <div className="sales-spinner"></div> <p>Loading sales...</p>{" "}
        </div>{" "}
      </div>
    );
  }
  if (error) {
    return (
      <div className="sales-page">
        {" "}
        <div className="sales-error">
          {" "}
          <div className="sales-error-icon"> ! </div> <h2>Sales unavailable</h2>{" "}
          <p>{error}</p> <button onClick={fetchSales}> Try Again </button>{" "}
        </div>{" "}
      </div>
    );
  }
  return (
    <div className="sales-page">
      {" "}
      <div className="sales-header">
        {" "}
        <div>
          {" "}
          <div className="sales-breadcrumb"> Dashboard / Sales </div>{" "}
          <h1>Sales</h1>{" "}
          <p>
            {" "}
            Track sales bills, customers, products and payment information.{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      {/* SUMMARY CARDS */}{" "}
      <div className="sales-stats">
        {" "}
        <div className="sales-stat-card">
          {" "}
          <div className="sales-stat-icon purple"> ₹ </div>{" "}
          <div>
            {" "}
            <span>Total Sales</span>{" "}
            <strong> ₹{totalSales.toLocaleString("en-IN")} </strong>{" "}
          </div>{" "}
        </div>{" "}
        <div className="sales-stat-card">
          {" "}
          <div className="sales-stat-icon blue"> 🧾 </div>{" "}
          <div>
            {" "}
            <span>Total Bills</span> <strong>{totalBills}</strong>{" "}
          </div>{" "}
        </div>{" "}
        <div className="sales-stat-card">
          {" "}
          <div className="sales-stat-icon green"> ↗ </div>{" "}
          <div>
            {" "}
            <span>Average Bill</span>{" "}
            <strong>
              {" "}
              ₹{Math.round(averageBill).toLocaleString("en-IN")}{" "}
            </strong>{" "}
          </div>{" "}
        </div>{" "}
        <div className="sales-stat-card">
          {" "}
          <div className="sales-stat-icon orange"> ✓ </div>{" "}
          <div>
            {" "}
            <span>Total Collected</span>{" "}
            <strong> ₹{totalPaid.toLocaleString("en-IN")} </strong>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* SECONDARY SUMMARY */}{" "}
      <div className="sales-summary-strip">
        {" "}
        <div className="sales-summary-item">
          {" "}
          <span>Items Sold</span> <strong>{totalItemsSold}</strong>{" "}
        </div>{" "}
        <div className="sales-summary-divider"></div>{" "}
        <div className="sales-summary-item">
          {" "}
          <span>Paid Bills</span> <strong>{paidBills}</strong>{" "}
        </div>{" "}
        <div className="sales-summary-divider"></div>{" "}
        <div className="sales-summary-item">
          {" "}
          <span>Partial Bills</span> <strong>{partialBills}</strong>{" "}
        </div>{" "}
        <div className="sales-summary-divider"></div>{" "}
        <div className="sales-summary-item">
          {" "}
          <span>Unpaid Bills</span> <strong>{unpaidBills}</strong>{" "}
        </div>{" "}
      </div>{" "}
      {/* SALES LIST */}{" "}
      <div className="sales-list-card">
        {" "}
        <div className="sales-list-header">
          {" "}
          <div>
            {" "}
            <h2>Sales Bills</h2>{" "}
            <p>
              {" "}
              {filteredSales.length} of {sales.length} sales bills{" "}
            </p>{" "}
          </div>{" "}
          <div className="sales-filters">
            {" "}
            <div className="sales-search">
              {" "}
              <span>⌕</span>{" "}
              <input
                type="text"
                placeholder="Search invoice or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />{" "}
            </div>{" "}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {" "}
              <option value="all"> All Status </option>{" "}
              <option value="COMPLETED"> Completed </option>{" "}
              <option value="PENDING"> Pending </option>{" "}
              <option value="CANCELLED"> Cancelled </option>{" "}
            </select>{" "}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              {" "}
              <option value="all"> All Payments </option>{" "}
              <option value="paid"> Paid </option>{" "}
              <option value="partial"> Partial </option>{" "}
              <option value="unpaid"> Unpaid </option>{" "}
            </select>{" "}
          </div>{" "}
        </div>{" "}
        {filteredSales.length === 0 ? (
          <div className="sales-empty">
            {" "}
            <div className="sales-empty-icon"> 🧾 </div>{" "}
            <h3>No sales bills found</h3>{" "}
            <p> Try changing your search or filters. </p>{" "}
          </div>
        ) : (
          <div className="sales-table-wrapper">
            {" "}
            <table className="sales-table">
              {" "}
              <thead>
                {" "}
                <tr>
                  {" "}
                  <th>Invoice</th> <th>Customer</th> <th>Date</th>{" "}
                  <th>Items</th> <th>Discount</th> <th>Total</th>{" "}
                  <th>Status</th> <th>Payment</th> <th></th>{" "}
                </tr>{" "}
              </thead>{" "}
              <tbody>
                {" "}
                {filteredSales.map((sale) => {
                  const paymentStatus = getPaymentStatus(sale);
                  const paymentClass = getPaymentClass(paymentStatus);
                  const itemCount = (sale.details || []).reduce(
                    (total, detail) => total + Number(detail.quantity || 0),
                    0,
                  );
                  const isExpanded = expandedSale === sale.id;
                  return (
                    <>
                      {" "}
                      <tr
                        key={sale.id}
                        className={isExpanded ? "sale-row-expanded" : ""}
                      >
                        {" "}
                        <td>
                          {" "}
                          <div className="invoice-profile">
                            {" "}
                            <div className="invoice-icon"> # </div>{" "}
                            <div>
                              {" "}
                              <strong>
                                {" "}
                                INV-2026-{" "}
                                {String(sale.id).padStart(3, "0")}{" "}
                              </strong>{" "}
                              <span> Bill ID: {sale.id} </span>{" "}
                            </div>{" "}
                          </div>{" "}
                        </td>{" "}
                        <td>
                          {" "}
                          <div className="sale-customer">
                            {" "}
                            <div className="customer-mini-avatar">
                              {" "}
                              {(sale.customer?.name || "Walk-in Customer")
                                .charAt(0)
                                .toUpperCase()}{" "}
                            </div>{" "}
                            <div>
                              {" "}
                              <strong>
                                {" "}
                                {sale.customer?.name || "Walk-in Customer"}{" "}
                              </strong>{" "}
                              <span>
                                {" "}
                                {sale.customer?.phone || "No phone"}{" "}
                              </span>{" "}
                            </div>{" "}
                          </div>{" "}
                        </td>{" "}
                        <td>
                          {" "}
                          <span className="sale-date">
                            {" "}
                            {formatDate(sale.billDate)}{" "}
                          </span>{" "}
                        </td>{" "}
                        <td>
                          {" "}
                          <span className="sale-item-count">
                            {" "}
                            {itemCount}{" "}
                          </span>{" "}
                        </td>{" "}
                        <td>
                          {" "}
                          <span className="sale-discount">
                            {" "}
                            ₹{" "}
                            {Number(sale.discount || 0).toLocaleString(
                              "en-IN",
                            )}{" "}
                          </span>{" "}
                        </td>{" "}
                        <td>
                          {" "}
                          <strong className="sale-total">
                            {" "}
                            ₹{" "}
                            {Number(sale.grandTotal || 0).toLocaleString(
                              "en-IN",
                            )}{" "}
                          </strong>{" "}
                        </td>{" "}
                        <td>
                          {" "}
                          <span className="sale-status">
                            {" "}
                            <span></span> {sale.status}{" "}
                          </span>{" "}
                        </td>{" "}
                        <td>
                          {" "}
                          <span className={`sale-payment ${paymentClass}`}>
                            {" "}
                            <span></span> {paymentStatus}{" "}
                          </span>{" "}
                        </td>{" "}
                        <td>
                          {" "}
                          <button
                            className="sale-view-button"
                            onClick={() => toggleSale(sale.id)}
                          >
                            {" "}
                            {isExpanded ? "Hide" : "View"}{" "}
                          </button>{" "}
                        </td>{" "}
                      </tr>{" "}
                      {isExpanded && (
                        <tr
                          key={`details-${sale.id}`}
                          className="sale-details-row"
                        >
                          {" "}
                          <td colSpan={9}>
                            {" "}
                            <div className="sale-details-panel">
                              {" "}
                              <div className="sale-details-heading">
                                {" "}
                                <div>
                                  {" "}
                                  <h3> Invoice Details </h3>{" "}
                                  <p>
                                    {" "}
                                    INV-2026-{" "}
                                    {String(sale.id).padStart(3, "0")}{" "}
                                  </p>{" "}
                                </div>{" "}
                                <div className="sale-detail-total">
                                  {" "}
                                  <span> Grand Total </span>{" "}
                                  <strong>
                                    {" "}
                                    ₹{" "}
                                    {Number(
                                      sale.grandTotal || 0,
                                    ).toLocaleString("en-IN")}{" "}
                                  </strong>{" "}
                                </div>{" "}
                              </div>{" "}
                              <div className="sale-items-table-wrapper">
                                {" "}
                                <table className="sale-items-table">
                                  {" "}
                                  <thead>
                                    {" "}
                                    <tr>
                                      {" "}
                                      <th> Product </th> <th> SKU </th>{" "}
                                      <th> Quantity </th> <th> Unit Price </th>{" "}
                                      <th> Discount </th> <th> Total </th>{" "}
                                    </tr>{" "}
                                  </thead>{" "}
                                  <tbody>
                                    {" "}
                                    {(sale.details || []).map((detail) => (
                                      <tr key={detail.id}>
                                        {" "}
                                        <td>
                                          {" "}
                                          <strong>
                                            {" "}
                                            {detail.product.name}{" "}
                                          </strong>{" "}
                                        </td>{" "}
                                        <td> {detail.product.sku} </td>{" "}
                                        <td> {detail.quantity} </td>{" "}
                                        <td>
                                          {" "}
                                          ₹{" "}
                                          {Number(
                                            detail.unitPrice,
                                          ).toLocaleString("en-IN")}{" "}
                                        </td>{" "}
                                        <td>
                                          {" "}
                                          ₹{" "}
                                          {Number(
                                            detail.discount || 0,
                                          ).toLocaleString("en-IN")}{" "}
                                        </td>{" "}
                                        <td>
                                          {" "}
                                          <strong>
                                            {" "}
                                            ₹{" "}
                                            {Number(
                                              detail.totalPrice,
                                            ).toLocaleString("en-IN")}{" "}
                                          </strong>{" "}
                                        </td>{" "}
                                      </tr>
                                    ))}{" "}
                                  </tbody>{" "}
                                </table>{" "}
                              </div>{" "}
                              <div className="sale-detail-footer">
                                {" "}
                                <div className="sale-payment-info">
                                  {" "}
                                  <span> Payment Method </span>{" "}
                                  <strong>
                                    {" "}
                                    {sale.payments?.length
                                      ? sale.payments
                                          .map(
                                            (payment) => payment.paymentMethod,
                                          )
                                          .join(", ")
                                      : "No payment recorded"}{" "}
                                  </strong>{" "}
                                </div>{" "}
                                <div className="sale-payment-info">
                                  {" "}
                                  <span> Amount Paid </span>{" "}
                                  <strong>
                                    {" "}
                                    ₹{" "}
                                    {getPaymentTotal(sale).toLocaleString(
                                      "en-IN",
                                    )}{" "}
                                  </strong>{" "}
                                </div>{" "}
                                <div className="sale-payment-info">
                                  {" "}
                                  <span> Remaining </span>{" "}
                                  <strong>
                                    {" "}
                                    ₹{" "}
                                    {Math.max(
                                      Number(sale.grandTotal || 0) -
                                        getPaymentTotal(sale),
                                      0,
                                    ).toLocaleString("en-IN")}{" "}
                                  </strong>{" "}
                                </div>{" "}
                              </div>{" "}
                            </div>{" "}
                          </td>{" "}
                        </tr>
                      )}{" "}
                    </>
                  );
                })}{" "}
              </tbody>{" "}
            </table>{" "}
          </div>
        )}{" "}
      </div>{" "}
      <div className="sales-info-strip">
        {" "}
        <div className="sales-info-icon"> 🧾 </div>{" "}
        <div>
          {" "}
          <strong>Sales Tracking</strong>{" "}
          <p>
            {" "}
            Sales bills are connected with customers, products and payment
            records. Expand an invoice to view its individual items.{" "}
          </p>{" "}
        </div>{" "}
        <div className="sales-info-summary">
          {" "}
          <span> Showing </span> <strong> {filteredSales.length} </strong>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default Sales;

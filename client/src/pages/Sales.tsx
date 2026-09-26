import { useState } from "react";

interface Sale {
  id: number;
  invoiceNumber: string;
  customer: string;
  saleDate: string;
  items: number;
  totalAmount: number;
  paymentStatus: "Paid" | "Pending" | "Partial";
  status: "Completed" | "Cancelled";
}

function Sales() {
  const [search, setSearch] = useState("");

  const sales: Sale[] = [
    {
      id: 1,
      invoiceNumber: "INV-2026-001",
      customer: "Rahul Sharma",
      saleDate: "2026-09-20",
      items: 5,
      totalAmount: 3250,
      paymentStatus: "Paid",
      status: "Completed",
    },
    {
      id: 2,
      invoiceNumber: "INV-2026-002",
      customer: "Priya Singh",
      saleDate: "2026-09-21",
      items: 3,
      totalAmount: 1850,
      paymentStatus: "Paid",
      status: "Completed",
    },
    {
      id: 3,
      invoiceNumber: "INV-2026-003",
      customer: "Amit Verma",
      saleDate: "2026-09-22",
      items: 7,
      totalAmount: 5400,
      paymentStatus: "Partial",
      status: "Completed",
    },
    {
      id: 4,
      invoiceNumber: "INV-2026-004",
      customer: "Neha Gupta",
      saleDate: "2026-09-23",
      items: 2,
      totalAmount: 950,
      paymentStatus: "Pending",
      status: "Completed",
    },
    {
      id: 5,
      invoiceNumber: "INV-2026-005",
      customer: "Walk-in Customer",
      saleDate: "2026-09-24",
      items: 4,
      totalAmount: 2200,
      paymentStatus: "Paid",
      status: "Cancelled",
    },
  ];

  const filteredSales = sales.filter(
    (sale) =>
      sale.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      sale.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sales-page">
      <div className="page-heading">
        <div>
          <h2>Sales</h2>
          <p>Manage sales invoices, customers and payments.</p>
        </div>

        <button className="add-product-btn">
          + Create Sale
        </button>
      </div>

      <div className="products-card">
        <div className="products-toolbar">
          <input
            type="text"
            placeholder="Search by invoice number or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select>
            <option value="">All Payment Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
          </select>
        </div>

        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Customer</th>
                <th>Sale Date</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td>
                    <strong>{sale.invoiceNumber}</strong>
                  </td>

                  <td>{sale.customer}</td>

                  <td>{sale.saleDate}</td>

                  <td>{sale.items}</td>

                  <td>
                    ₹{sale.totalAmount.toLocaleString("en-IN")}
                  </td>

                  <td>
                    <span
                      className={`status-badge ${sale.paymentStatus
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {sale.paymentStatus}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status-badge ${
                        sale.status === "Completed"
                          ? "in-stock"
                          : "out-of-stock"
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn">View</button>
                      <button className="delete-btn">Return</button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={8} className="no-products">
                    No sales found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Sales;
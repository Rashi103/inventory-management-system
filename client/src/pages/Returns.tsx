import { useState } from "react";

interface ReturnRecord {
  id: number;
  returnNumber: string;
  type: "Sales Return" | "Purchase Return";
  referenceNumber: string;
  party: string;
  returnDate: string;
  items: number;
  amount: number;
  status: "Completed" | "Pending" | "Cancelled";
}

function Returns() {
  const [search, setSearch] = useState("");
  const [returnType, setReturnType] = useState<
    "All" | "Sales Return" | "Purchase Return"
  >("All");

  const returns: ReturnRecord[] = [
    {
      id: 1,
      returnNumber: "SR-2026-001",
      type: "Sales Return",
      referenceNumber: "INV-2026-002",
      party: "Priya Singh",
      returnDate: "2026-09-22",
      items: 2,
      amount: 850,
      status: "Completed",
    },
    {
      id: 2,
      returnNumber: "PR-2026-001",
      type: "Purchase Return",
      referenceNumber: "PO-2026-001",
      party: "Tata Consumer Products",
      returnDate: "2026-09-23",
      items: 3,
      amount: 4200,
      status: "Pending",
    },
    {
      id: 3,
      returnNumber: "SR-2026-002",
      type: "Sales Return",
      referenceNumber: "INV-2026-003",
      party: "Amit Verma",
      returnDate: "2026-09-24",
      items: 1,
      amount: 450,
      status: "Completed",
    },
    {
      id: 4,
      returnNumber: "PR-2026-002",
      type: "Purchase Return",
      referenceNumber: "PO-2026-003",
      party: "Global Distributors",
      returnDate: "2026-09-25",
      items: 2,
      amount: 1800,
      status: "Cancelled",
    },
  ];

  const filteredReturns = returns.filter((item) => {
    const matchesSearch =
      item.returnNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.party.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      returnType === "All" || item.type === returnType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="returns-page">
      <div className="page-heading">
        <div>
          <h2>Returns</h2>
          <p>Manage sales returns and purchase returns.</p>
        </div>

        <button className="add-product-btn">
          + Create Return
        </button>
      </div>

      <div className="products-card">
        <div className="products-toolbar">
          <input
            type="text"
            placeholder="Search return number, reference or party..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={returnType}
            onChange={(e) =>
              setReturnType(
                e.target.value as
                  | "All"
                  | "Sales Return"
                  | "Purchase Return"
              )
            }
          >
            <option value="All">All Returns</option>
            <option value="Sales Return">Sales Returns</option>
            <option value="Purchase Return">Purchase Returns</option>
          </select>
        </div>

        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Return Number</th>
                <th>Type</th>
                <th>Reference</th>
                <th>Customer / Supplier</th>
                <th>Return Date</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredReturns.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.returnNumber}</strong>
                  </td>

                  <td>{item.type}</td>

                  <td>{item.referenceNumber}</td>

                  <td>{item.party}</td>

                  <td>{item.returnDate}</td>

                  <td>{item.items}</td>

                  <td>
                    ₹{item.amount.toLocaleString("en-IN")}
                  </td>

                  <td>
                    <span
                      className={`status-badge ${
                        item.status === "Completed"
                          ? "in-stock"
                          : item.status === "Pending"
                          ? "low-stock"
                          : "out-of-stock"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn">View</button>
                      <button className="delete-btn">Cancel</button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredReturns.length === 0 && (
                <tr>
                  <td colSpan={9} className="no-products">
                    No returns found.
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

export default Returns;
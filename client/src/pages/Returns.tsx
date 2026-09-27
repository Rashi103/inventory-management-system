import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Returns.css";
import api from "../services/axios";

interface ReturnRecord {
  id: number;
  returnNumber: string;
  type: string;
  referenceNumber: string;
  party: string;
  returnDate: string;
  items: number;
  amount: number;
  status: string;
}

const Returns = () => {
  const [returns, setReturns] = useState<ReturnRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

// =========================
// FETCH RETURNS
// =========================

useEffect(() => {
  const fetchReturns = async () => {
    try {
      setLoading(true);

      const response = await api.get("/returns");

      const mappedReturns: ReturnRecord[] = response.data.map(
        (item: any) => ({
          id: item.id,
          returnNumber: `RET-${item.id}`,
          type: "Sales Return",
          referenceNumber: `INV-${item.salesBillId}`,
          party: item.salesBill?.customerId
            ? `Customer #${item.salesBill.customerId}`
            : "Walk-in Customer",
          returnDate: item.returnDate,
          items: Number(item.quantity || 0),
          amount: Number(item.refundAmount || 0),
          status: "Completed",
        }),
      );

      setReturns(mappedReturns);
      setError("");
    } catch (error) {
      console.error("Error fetching returns:", error);

      setError(
        "Failed to load returns. Please make sure the server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  fetchReturns();
}, []);


  // =========================
  // FILTER
  // =========================

  const filteredReturns = useMemo(() => {
    const search = (searchTerm || "").toLowerCase().trim();
    const selectedType = (typeFilter || "all").toLowerCase();

    return returns.filter((item) => {
      const returnNumber = String(item.returnNumber || "").toLowerCase();
      const referenceNumber = String(item.referenceNumber || "").toLowerCase();
      const party = String(item.party || "").toLowerCase();
      const type = String(item.type || "").toLowerCase();

      const matchesSearch =
        !search ||
        returnNumber.includes(search) ||
        referenceNumber.includes(search) ||
        party.includes(search);

      const matchesType = selectedType === "all" || type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [returns, searchTerm, typeFilter]);

  // =========================
  // SUMMARY
  // =========================

  const salesReturns = returns.filter((item) => item.type === "Sales Return");

  const purchaseReturns = returns.filter(
    (item) => item.type === "Purchase Return",
  );

  const totalReturnedItems = returns.reduce(
    (total, item) => total + Number(item.items || 0),
    0,
  );

  const totalReturnAmount = returns.reduce(
    (total, item) => total + Number(item.amount || 0),
    0,
  );

  const salesReturnAmount = salesReturns.reduce(
    (total, item) => total + Number(item.amount || 0),
    0,
  );

  const purchaseReturnAmount = purchaseReturns.reduce(
    (total, item) => total + Number(item.amount || 0),
    0,
  );

  // =========================
  // DATE
  // =========================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // TYPE CLASS
  // =========================

  const getTypeClass = (type: string) => {
    return type === "Sales Return" ? "sales-return" : "purchase-return";
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="returns-page">
        <div className="returns-loading">
          <div className="returns-spinner"></div>
          <p>Loading returns...</p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="returns-page">
        <div className="returns-error">
          <div className="returns-error-icon">!</div>

          <h2>Returns unavailable</h2>

          <p>{error}</p>

          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="returns-page">
      {/* HEADER */}

      <div className="returns-header">
        <div>
          <div className="returns-breadcrumb">Dashboard / Returns</div>

          <h1>Returns</h1>

          <p>Track sales returns, purchase returns and returned stock.</p>
        </div>
      </div>

      {/* STATS */}

      <div className="returns-stats">
        <div className="return-stat-card">
          <div className="return-stat-icon purple">↩</div>

          <div>
            <span>Total Returns</span>
            <strong>{returns.length}</strong>
          </div>
        </div>

        <div className="return-stat-card">
          <div className="return-stat-icon red">↓</div>

          <div>
            <span>Returned Items</span>
            <strong>{totalReturnedItems}</strong>
          </div>
        </div>

        <div className="return-stat-card">
          <div className="return-stat-icon orange">₹</div>

          <div>
            <span>Total Return Value</span>
            <strong>₹{totalReturnAmount.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        <div className="return-stat-card">
          <div className="return-stat-icon green">✓</div>

          <div>
            <span>Completed</span>
            <strong>
              {
                returns.filter(
                  (item) => item.status.toLowerCase() === "completed",
                ).length
              }
            </strong>
          </div>
        </div>
      </div>

      {/* SUMMARY STRIP */}

      <div className="returns-summary-strip">
        <div className="returns-summary-item">
          <span>Sales Returns</span>
          <strong>{salesReturns.length}</strong>
        </div>

        <div className="returns-summary-divider"></div>

        <div className="returns-summary-item">
          <span>Sales Return Value</span>
          <strong>₹{salesReturnAmount.toLocaleString("en-IN")}</strong>
        </div>

        <div className="returns-summary-divider"></div>

        <div className="returns-summary-item">
          <span>Purchase Returns</span>
          <strong>{purchaseReturns.length}</strong>
        </div>

        <div className="returns-summary-divider"></div>

        <div className="returns-summary-item">
          <span>Purchase Return Value</span>
          <strong>₹{purchaseReturnAmount.toLocaleString("en-IN")}</strong>
        </div>

        <div className="returns-summary-divider"></div>

        <div className="returns-summary-item">
          <span>Showing</span>
          <strong>{filteredReturns.length} returns</strong>
        </div>
      </div>

      {/* RETURNS LIST */}

      <div className="returns-list-card">
        <div className="returns-list-header">
          <div>
            <h2>Return Transactions</h2>

            <p>
              {filteredReturns.length} of {returns.length} return records
            </p>
          </div>

          <div className="returns-filters">
            <div className="returns-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search returns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>

              <option value="Sales Return">Sales Returns</option>

              <option value="Purchase Return">Purchase Returns</option>
            </select>
          </div>
        </div>

        {filteredReturns.length === 0 ? (
          <div className="returns-empty">
            <div className="returns-empty-icon">↩</div>

            <h3>No returns found</h3>

            <p>Try changing your search or return type filter.</p>
          </div>
        ) : (
          <div className="returns-table-wrapper">
            <table className="returns-table">
              <thead>
                <tr>
                  <th>Return</th>
                  <th>Type</th>
                  <th>Reference</th>
                  <th>Party</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredReturns.map((item) => {
                  const typeClass = getTypeClass(item.type);

                  return (
                    <tr key={`${item.type}-${item.id}`}>
                      {/* RETURN */}

                      <td>
                        <div className="return-profile">
                          <div className={`return-icon ${typeClass}`}>↩</div>

                          <div>
                            <strong>{item.returnNumber}</strong>

                            <span>Return #{item.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* TYPE */}

                      <td>
                        <span className={`return-type ${typeClass}`}>
                          {item.type}
                        </span>
                      </td>

                      {/* REFERENCE */}

                      <td>
                        <span className="return-reference">
                          {item.referenceNumber}
                        </span>
                      </td>

                      {/* PARTY */}

                      <td>
                        <div className="return-party">
                          <strong>{item.party}</strong>
                        </div>
                      </td>

                      {/* DATE */}

                      <td>
                        <span className="return-date">
                          {formatDate(item.returnDate)}
                        </span>
                      </td>

                      {/* ITEMS */}

                      <td>
                        <span className="return-item-count">{item.items}</span>
                      </td>

                      {/* AMOUNT */}

                      <td>
                        <strong className="return-amount">
                          ₹{Number(item.amount).toLocaleString("en-IN")}
                        </strong>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span className="return-status">
                          <span></span>
                          {item.status}
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

      {/* INFO STRIP */}

      <div className="returns-info-strip">
        <div className="returns-info-icon">↩</div>

        <div>
          <strong>Return Tracking</strong>

          <p>
            Sales returns are linked to customer invoices, while purchase
            returns are linked to suppliers.
          </p>
        </div>

        <div className="returns-info-summary">
          <span>Returned Items</span>

          <strong>{totalReturnedItems}</strong>
        </div>
      </div>
    </div>
  );
};

export default Returns;

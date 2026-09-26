
import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
}

interface PurchaseDetail {
  id: number;
  quantity: number;
  unitCost: string;
  totalCost: string;
  product: Product;
}

interface Supplier {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  name: string;
}

interface PurchaseOrder {
  id: number;
  orderDate: string;
  status: string;
  totalAmount: string;
  remarks: string | null;
  supplier: Supplier;
  employee: Employee;
  details: PurchaseDetail[];
}

function Purchases() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [purchases, setPurchases] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/purchases"
        );

        setPurchases(response.data);
      } catch (error) {
        console.error("Error fetching purchases:", error);
        setError("Failed to load purchase orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const getOrderNumber = (id: number) => {
    return `PO-${String(id).padStart(3, "0")}`;
  };

  const getStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const filteredPurchases = purchases.filter((purchase) => {
    const orderNumber = getOrderNumber(purchase.id);
    const status = getStatus(purchase.status);

    const matchesSearch =
      orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      purchase.supplier.name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === "" || status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="purchases-page">Loading purchases...</div>;
  }

  if (error) {
    return <div className="purchases-page">{error}</div>;
  }

  return (
    <div className="purchases-page">
      <div className="page-heading">
        <div>
          <h2>Purchases</h2>
          <p>Manage purchase orders and supplier purchases.</p>
        </div>

        <button className="add-product-btn">
          + Create Purchase Order
        </button>
      </div>

      <div className="products-card">
        <div className="products-toolbar">
          <input
            type="text"
            placeholder="Search by order number or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Received">Received</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Supplier</th>
                <th>Order Date</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPurchases.map((purchase) => {
                const status = getStatus(purchase.status);

                return (
                  <tr key={purchase.id}>
                    <td>
                      <strong>{getOrderNumber(purchase.id)}</strong>
                    </td>

                    <td>{purchase.supplier.name}</td>

                    <td>
                      {new Date(
                        purchase.orderDate
                      ).toLocaleDateString("en-IN")}
                    </td>

                    <td>{purchase.details.length}</td>

                    <td>
                      ₹
                      {Number(purchase.totalAmount).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn">
                          View
                        </button>

                        <button className="delete-btn">
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredPurchases.length === 0 && (
                <tr>
                  <td colSpan={7} className="no-products">
                    No purchase orders found.
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

export default Purchases;


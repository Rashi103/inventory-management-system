
import { useEffect, useState } from "react";
import axios from "axios";

interface Supplier {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  address: string | null;
  gstNumber: string | null;
  isActive: boolean;
  purchaseOrders: { id: number }[];
  purchaseReturns: { id: number }[];
}

function Suppliers() {
  const [search, setSearch] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/suppliers"
        );

        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        setError("Failed to load suppliers.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(search.toLowerCase()) ||
      supplier.phone.includes(search) ||
      (supplier.email ?? "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (supplier.gstNumber ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="suppliers-page">Loading suppliers...</div>;
  }

  if (error) {
    return <div className="suppliers-page">{error}</div>;
  }

  return (
    <div className="suppliers-page">
      <div className="page-heading">
        <div>
          <h2>Suppliers</h2>
          <p>Manage your suppliers and supplier information.</p>
        </div>

        <button className="add-product-btn">
          + Add Supplier
        </button>
      </div>

      <div className="products-card">
        <div className="products-toolbar">
          <input
            type="text"
            placeholder="Search suppliers by name, phone, email or GST..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Contact Person</th>
                <th>Phone</th>
                <th>Email</th>
                <th>GST Number</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>
                    <strong>{supplier.name}</strong>
                  </td>

                  <td>—</td>

                  <td>{supplier.phone}</td>

                  <td>{supplier.email || "—"}</td>

                  <td>{supplier.gstNumber || "—"}</td>

                  <td>
                    <span
                      className={`status-badge ${
                        supplier.isActive
                          ? "in-stock"
                          : "out-of-stock"
                      }`}
                    >
                      {supplier.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn">
                        Edit
                      </button>

                      <button className="delete-btn">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSuppliers.length === 0 && (
                <tr>
                  <td colSpan={7} className="no-products">
                    No suppliers found.
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

export default Suppliers;


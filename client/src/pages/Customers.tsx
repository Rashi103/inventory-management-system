import { useEffect, useState } from "react";
import axios from "axios";

interface SalesBill {
  grandTotal: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  isActive: boolean;
  salesBills: SalesBill[];
}

function Customers() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/customers"
        );

        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setError("Failed to load customers.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const getTotalPurchases = (customer: Customer) => {
    return customer.salesBills.reduce(
      (total, bill) => total + Number(bill.grandTotal),
      0
    );
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchText = search.toLowerCase();

    return (
      customer.name.toLowerCase().includes(searchText) ||
      (customer.phone ?? "").includes(search) ||
      (customer.email ?? "").toLowerCase().includes(searchText) ||
      (customer.address ?? "").toLowerCase().includes(searchText)
    );
  });

  if (loading) {
    return <div className="customers-page">Loading customers...</div>;
  }

  if (error) {
    return <div className="customers-page">{error}</div>;
  }

  return (
    <div className="customers-page">
      <div className="page-heading">
        <div>
          <h2>Customers</h2>
          <p>Manage customers and track their purchase information.</p>
        </div>

        <button className="add-product-btn">
          + Add Customer
        </button>
      </div>

      <div className="products-card">
        <div className="products-toolbar">
          <input
            type="text"
            placeholder="Search customers by name, phone, email or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Total Purchases</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => {
                const totalPurchases = getTotalPurchases(customer);

                return (
                  <tr key={customer.id}>
                    <td>
                      <strong>{customer.name}</strong>
                    </td>

                    <td>{customer.phone || "—"}</td>

                    <td>{customer.email || "—"}</td>

                    <td>{customer.address || "—"}</td>

                    <td>
                      ₹{totalPurchases.toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          customer.isActive
                            ? "in-stock"
                            : "out-of-stock"
                        }`}
                      >
                        {customer.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="no-products">
                    No customers found.
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

export default Customers;


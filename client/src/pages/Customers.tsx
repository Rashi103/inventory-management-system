import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import api from "../services/axios";
import "./Customers.css";

interface SalesBill {
  id: number;
  grandTotal: string | number;
}

interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  isActive: boolean;
  salesBills: SalesBill[];
}

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const emptyForm: CustomerForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CustomerForm>(emptyForm);

  // =========================
  // FETCH CUSTOMERS
  // =========================

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/customers");

      setCustomers(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching customers:", error);

      setError(
        "Failed to load customers. Please make sure the server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // =========================
  // FILTER
  // =========================

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return customers.filter((customer) => {
      const matchesSearch =
        !search ||
        customer.name.toLowerCase().includes(search) ||
        (customer.email || "").toLowerCase().includes(search) ||
        (customer.phone || "").toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && customer.isActive) ||
        (statusFilter === "inactive" && !customer.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  // =========================
  // SUMMARY
  // =========================

  const activeCustomers = customers.filter(
    (customer) => customer.isActive,
  ).length;

  const inactiveCustomers = customers.filter(
    (customer) => !customer.isActive,
  ).length;

  const totalBills = customers.reduce(
    (total, customer) => total + (customer.salesBills?.length || 0),
    0,
  );

  const totalPurchases = customers.reduce(
    (total, customer) =>
      total +
      (customer.salesBills || []).reduce(
        (sum, bill) => sum + Number(bill.grandTotal || 0),
        0,
      ),
    0,
  );

  // =========================
  // FORM
  // =========================

  const handleInputChange = (field: keyof CustomerForm, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setShowForm(false);
  };

  // =========================
  // CREATE CUSTOMER
  // =========================

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter customer name.");
      return;
    }

    try {
      await api.post("/customers", {
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
      });

      alert("Customer added successfully!");

      resetForm();
      await fetchCustomers();
    } catch (error) {
      console.error("Error creating customer:", error);

      alert("Failed to add customer. Please check the details and try again.");
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="customers-page">
        <div className="customers-loading">
          <div className="customers-spinner"></div>
          <p>Loading customers...</p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="customers-page">
        <div className="customers-error">
          <div className="customers-error-icon">!</div>

          <h2>Customers unavailable</h2>

          <p>{error}</p>

          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="customers-page">
      {/* HEADER */}

      <div className="customers-header">
        <div>
          <div className="customers-breadcrumb">Dashboard / Customers</div>

          <h1>Customers</h1>

          <p>Manage customer information and purchase activity.</p>
        </div>

        <button
          className="customer-add-button"
          onClick={() => {
            setForm(emptyForm);
            setShowForm(true);
          }}
        >
          <span>+</span>
          Add Customer
        </button>
      </div>

      {/* STATS */}

      <div className="customers-stats">
        <div className="customer-stat-card">
          <div className="customer-stat-icon purple">◉</div>

          <div>
            <span>Total Customers</span>
            <strong>{customers.length}</strong>
          </div>
        </div>

        <div className="customer-stat-card">
          <div className="customer-stat-icon green">✓</div>

          <div>
            <span>Active Customers</span>
            <strong>{activeCustomers}</strong>
          </div>
        </div>

        <div className="customer-stat-card">
          <div className="customer-stat-icon blue">🧾</div>

          <div>
            <span>Total Bills</span>
            <strong>{totalBills}</strong>
          </div>
        </div>

        <div className="customer-stat-card">
          <div className="customer-stat-icon orange">₹</div>

          <div>
            <span>Total Purchases</span>
            <strong>₹{totalPurchases.toLocaleString("en-IN")}</strong>
          </div>
        </div>
      </div>

      {/* ADD CUSTOMER FORM */}

      {showForm && (
        <div className="customer-form-card">
          <div className="customer-form-header">
            <div>
              <h2>Add New Customer</h2>

              <p>Enter the customer information below.</p>
            </div>

            <button className="customer-close-button" onClick={resetForm}>
              ×
            </button>
          </div>

          <form className="customer-form" onSubmit={handleCreateCustomer}>
            <div className="customer-form-grid">
              <div className="customer-form-group">
                <label>Customer Name *</label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>

              <div className="customer-form-group">
                <label>Phone</label>

                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="customer-form-group">
                <label>Email</label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="customer@example.com"
                />
              </div>

              <div className="customer-form-group">
                <label>Address</label>

                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter customer address"
                />
              </div>
            </div>

            <div className="customer-form-actions">
              <button
                type="button"
                className="customer-cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button type="submit" className="customer-save-button">
                Add Customer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CUSTOMER LIST */}

      <div className="customers-list-card">
        <div className="customers-list-header">
          <div>
            <h2>Customer List</h2>

            <p>
              {filteredCustomers.length} of {customers.length} customers
            </p>
          </div>

          <div className="customers-filters">
            <div className="customers-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="customers-empty">
            <div className="customers-empty-icon">◉</div>

            <h3>No customers found</h3>

            <p>Try changing your search or status filter.</p>
          </div>
        ) : (
          <div className="customers-table-wrapper">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Bills</th>
                  <th>Purchase Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => {
                  const bills = customer.salesBills?.length || 0;

                  const purchaseAmount = (customer.salesBills || []).reduce(
                    (sum, bill) => sum + Number(bill.grandTotal || 0),
                    0,
                  );

                  return (
                    <tr key={customer.id}>
                      <td>
                        <div className="customer-profile">
                          <div className="customer-avatar">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <strong>{customer.name}</strong>

                            <span>ID: {customer.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="customer-contact">
                          <strong>{customer.phone || "No phone"}</strong>

                          <span>{customer.email || "No email"}</span>
                        </div>
                      </td>

                      <td>
                        <span className="customer-address">
                          {customer.address || "Not provided"}
                        </span>
                      </td>

                      <td>
                        <span className="customer-bill-count">{bills}</span>
                      </td>

                      <td>
                        <strong className="customer-purchase-amount">
                          ₹{purchaseAmount.toLocaleString("en-IN")}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`customer-status ${
                            customer.isActive ? "active" : "inactive"
                          }`}
                        >
                          <span></span>

                          {customer.isActive ? "Active" : "Inactive"}
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

      <div className="customer-info-strip">
        <div className="customer-info-icon">✓</div>

        <div>
          <strong>Customer Management</strong>

          <p>
            Customer purchase activity is calculated from completed sales bills.
          </p>
        </div>

        <div className="customer-info-summary">
          <span>Inactive Customers</span>

          <strong>{inactiveCustomers}</strong>
        </div>
      </div>
    </div>
  );
};

export default Customers;

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Suppliers.css";
import api from "../services/axios";
interface PurchaseOrder {
  id: number;
}

interface PurchaseReturn {
  id: number;
}

interface Supplier {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  address: string | null;
  gstNumber: string | null;
  isActive: boolean;
  purchaseOrders: PurchaseOrder[];
  purchaseReturns: PurchaseReturn[];
}

interface SupplierForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
}

const emptyForm: SupplierForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  gstNumber: "",
};

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<SupplierForm>(emptyForm);

  // =========================
  // FETCH SUPPLIERS
  // =========================

  const fetchSuppliers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/suppliers");

      setSuppliers(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching suppliers:", error);

      setError(
        "Failed to load suppliers. Please make sure the server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // =========================
  // FILTER
  // =========================

  const filteredSuppliers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return suppliers.filter((supplier) => {
      const matchesSearch =
        !search ||
        supplier.name.toLowerCase().includes(search) ||
        (supplier.email || "").toLowerCase().includes(search) ||
        supplier.phone.toLowerCase().includes(search) ||
        (supplier.gstNumber || "").toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && supplier.isActive) ||
        (statusFilter === "inactive" && !supplier.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [suppliers, searchTerm, statusFilter]);

  // =========================
  // SUMMARY
  // =========================

  const activeSuppliers = suppliers.filter(
    (supplier) => supplier.isActive,
  ).length;

  const inactiveSuppliers = suppliers.filter(
    (supplier) => !supplier.isActive,
  ).length;

  const totalOrders = suppliers.reduce(
    (total, supplier) => total + (supplier.purchaseOrders?.length || 0),
    0,
  );

  const totalReturns = suppliers.reduce(
    (total, supplier) => total + (supplier.purchaseReturns?.length || 0),
    0,
  );

  // =========================
  // FORM
  // =========================

  const handleInputChange = (field: keyof SupplierForm, value: string) => {
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
  // CREATE SUPPLIER
  // =========================

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter supplier name.");
      return;
    }

    if (!form.phone.trim()) {
      alert("Please enter supplier phone number.");
      return;
    }

    try {
      await api.post("/suppliers", {
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim(),
        address: form.address.trim() || null,
        gstNumber: form.gstNumber.trim() || null,
      });

      alert("Supplier added successfully!");

      resetForm();
      await fetchSuppliers();
    } catch (error) {
      console.error("Error creating supplier:", error);

      alert("Failed to add supplier. Please check the details and try again.");
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="suppliers-page">
        <div className="suppliers-loading">
          <div className="suppliers-spinner"></div>
          <p>Loading suppliers...</p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="suppliers-page">
        <div className="suppliers-error">
          <div className="suppliers-error-icon">!</div>

          <h2>Suppliers unavailable</h2>

          <p>{error}</p>

          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="suppliers-page">
      {/* HEADER */}

      <div className="suppliers-header">
        <div>
          <div className="suppliers-breadcrumb">Dashboard / Suppliers</div>

          <h1>Suppliers</h1>

          <p>
            Manage supplier information, contacts and purchasing relationships.
          </p>
        </div>

        <button
          className="supplier-add-button"
          onClick={() => {
            setForm(emptyForm);
            setShowForm(true);
          }}
        >
          <span>+</span>
          Add Supplier
        </button>
      </div>

      {/* STATS */}

      <div className="suppliers-stats">
        <div className="supplier-stat-card">
          <div className="supplier-stat-icon purple">◈</div>

          <div>
            <span>Total Suppliers</span>
            <strong>{suppliers.length}</strong>
          </div>
        </div>

        <div className="supplier-stat-card">
          <div className="supplier-stat-icon green">✓</div>

          <div>
            <span>Active Suppliers</span>
            <strong>{activeSuppliers}</strong>
          </div>
        </div>

        <div className="supplier-stat-card">
          <div className="supplier-stat-icon blue">📋</div>

          <div>
            <span>Purchase Orders</span>
            <strong>{totalOrders}</strong>
          </div>
        </div>

        <div className="supplier-stat-card">
          <div className="supplier-stat-icon orange">↩</div>

          <div>
            <span>Purchase Returns</span>
            <strong>{totalReturns}</strong>
          </div>
        </div>
      </div>

      {/* ADD SUPPLIER FORM */}

      {showForm && (
        <div className="supplier-form-card">
          <div className="supplier-form-header">
            <div>
              <h2>Add New Supplier</h2>

              <p>Enter the supplier information below.</p>
            </div>

            <button className="supplier-close-button" onClick={resetForm}>
              ×
            </button>
          </div>

          <form className="supplier-form" onSubmit={handleCreateSupplier}>
            <div className="supplier-form-grid">
              <div className="supplier-form-group">
                <label>Supplier Name *</label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter supplier name"
                />
              </div>

              <div className="supplier-form-group">
                <label>Phone *</label>

                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="supplier-form-group">
                <label>Email</label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="supplier@example.com"
                />
              </div>

              <div className="supplier-form-group">
                <label>GST Number</label>

                <input
                  type="text"
                  value={form.gstNumber}
                  onChange={(e) =>
                    handleInputChange("gstNumber", e.target.value)
                  }
                  placeholder="Enter GST number"
                />
              </div>

              <div className="supplier-form-group supplier-address-group">
                <label>Address</label>

                <textarea
                  value={form.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter supplier address"
                  rows={3}
                />
              </div>
            </div>

            <div className="supplier-form-actions">
              <button
                type="button"
                className="supplier-cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button type="submit" className="supplier-save-button">
                Add Supplier
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUPPLIER LIST */}

      <div className="suppliers-list-card">
        <div className="suppliers-list-header">
          <div>
            <h2>Supplier List</h2>

            <p>
              {filteredSuppliers.length} of {suppliers.length} suppliers
            </p>
          </div>

          <div className="suppliers-filters">
            <div className="suppliers-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search suppliers..."
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

        {filteredSuppliers.length === 0 ? (
          <div className="suppliers-empty">
            <div className="suppliers-empty-icon">◈</div>

            <h3>No suppliers found</h3>

            <p>Try changing your search or status filter.</p>
          </div>
        ) : (
          <div className="suppliers-table-wrapper">
            <table className="suppliers-table">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Contact</th>
                  <th>GST Number</th>
                  <th>Orders</th>
                  <th>Returns</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredSuppliers.map((supplier) => {
                  const orders = supplier.purchaseOrders?.length || 0;

                  const returns = supplier.purchaseReturns?.length || 0;

                  return (
                    <tr key={supplier.id}>
                      <td>
                        <div className="supplier-profile">
                          <div className="supplier-avatar">
                            {supplier.name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <strong>{supplier.name}</strong>

                            <span>ID: {supplier.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="supplier-contact">
                          <strong>{supplier.phone}</strong>

                          <span>{supplier.email || "No email"}</span>
                        </div>
                      </td>

                      <td>
                        <span className="supplier-gst">
                          {supplier.gstNumber || "Not provided"}
                        </span>
                      </td>

                      <td>
                        <span className="supplier-count order">{orders}</span>
                      </td>

                      <td>
                        <span className="supplier-count return">{returns}</span>
                      </td>

                      <td>
                        <span
                          className={`supplier-status ${
                            supplier.isActive ? "active" : "inactive"
                          }`}
                        >
                          <span></span>

                          {supplier.isActive ? "Active" : "Inactive"}
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

      <div className="supplier-info-strip">
        <div className="supplier-info-icon">✓</div>

        <div>
          <strong>Supplier Management</strong>

          <p>
            Keep supplier contact and GST information updated for smooth
            purchase operations.
          </p>
        </div>

        <div className="supplier-info-summary">
          <span>Inactive Suppliers</span>
          <strong>{inactiveSuppliers}</strong>
        </div>
      </div>
    </div>
  );
};

export default Suppliers;

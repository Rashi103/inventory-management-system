
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Brands.css";

interface Product {
  id: number;
}

interface Brand {
  id: number;
  name: string;
  description: string | null;
  products: Product[];
}

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");

  // =========================
  // FETCH BRANDS
  // =========================

  const fetchBrands = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/brands"
      );

      setBrands(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching brands:", error);

      setError(
        "Failed to load brands. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredBrands = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return brands;
    }

    return brands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(search) ||
        (brand.description || "")
          .toLowerCase()
          .includes(search)
    );
  }, [brands, searchTerm]);

  // =========================
  // SUMMARY
  // =========================

  const totalProducts = brands.reduce(
    (total, brand) =>
      total + (brand.products?.length || 0),
    0
  );

  const usedBrands = brands.filter(
    (brand) => (brand.products?.length || 0) > 0
  ).length;

  const unusedBrands = brands.filter(
    (brand) => (brand.products?.length || 0) === 0
  ).length;

  // =========================
  // CREATE BRAND
  // =========================

  const handleCreateBrand = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!brandName.trim()) {
      alert("Please enter a brand name.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/brands",
        {
          name: brandName.trim(),
          description: description.trim() || null,
        }
      );

      alert("Brand created successfully!");

      setBrandName("");
      setDescription("");
      setShowForm(false);

      await fetchBrands();
    } catch (error) {
      console.error("Error creating brand:", error);

      alert(
        "Failed to create brand. The brand name may already exist."
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="brands-page">
        <div className="brands-loading">
          <div className="brands-spinner"></div>
          <p>Loading brands...</p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="brands-page">
        <div className="brands-error">
          <div className="brands-error-icon">!</div>

          <h2>Brands unavailable</h2>

          <p>{error}</p>

          <button
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="brands-page">

      {/* HEADER */}

      <div className="brands-header">

        <div>
          <div className="brands-breadcrumb">
            Dashboard / Brands
          </div>

          <h1>Brands</h1>

          <p>
            Manage the brands associated with
            your product catalog.
          </p>
        </div>

        <button
          className="brand-add-button"
          onClick={() => setShowForm(!showForm)}
        >
          <span>+</span>
          Add Brand
        </button>

      </div>

      {/* STATS */}

      <div className="brands-stats">

        <div className="brand-stat-card">
          <div className="brand-stat-icon purple">
            ◈
          </div>

          <div>
            <span>Total Brands</span>
            <strong>{brands.length}</strong>
          </div>
        </div>

        <div className="brand-stat-card">
          <div className="brand-stat-icon green">
            ✓
          </div>

          <div>
            <span>Brands In Use</span>
            <strong>{usedBrands}</strong>
          </div>
        </div>

        <div className="brand-stat-card">
          <div className="brand-stat-icon blue">
            📦
          </div>

          <div>
            <span>Products Assigned</span>
            <strong>{totalProducts}</strong>
          </div>
        </div>

        <div className="brand-stat-card">
          <div className="brand-stat-icon orange">
            ○
          </div>

          <div>
            <span>Unused Brands</span>
            <strong>{unusedBrands}</strong>
          </div>
        </div>

      </div>

      {/* ADD BRAND FORM */}

      {showForm && (
        <div className="brand-form-card">

          <div className="brand-form-header">

            <div>
              <h2>Add New Brand</h2>

              <p>
                Enter the brand information below.
              </p>
            </div>

            <button
              className="brand-close-button"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>

          </div>

          <form
            className="brand-form"
            onSubmit={handleCreateBrand}
          >

            <div className="brand-form-grid">

              <div className="brand-form-group">
                <label>Brand Name *</label>

                <input
                  type="text"
                  value={brandName}
                  onChange={(e) =>
                    setBrandName(e.target.value)
                  }
                  placeholder="e.g. Britannia"
                />
              </div>

              <div className="brand-form-group">
                <label>Description</label>

                <input
                  type="text"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Short brand description"
                />
              </div>

            </div>

            <div className="brand-form-actions">

              <button
                type="button"
                className="brand-cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="brand-save-button"
              >
                Create Brand
              </button>

            </div>

          </form>

        </div>
      )}

      {/* BRAND LIST */}

      <div className="brands-list-card">

        <div className="brands-list-header">

          <div>
            <h2>Brand List</h2>

            <p>
              {filteredBrands.length} of{" "}
              {brands.length} brands
            </p>
          </div>

          <div className="brands-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

        </div>

        {filteredBrands.length === 0 ? (
          <div className="brands-empty">

            <div className="brands-empty-icon">
              ◈
            </div>

            <h3>No brands found</h3>

            <p>
              Try changing your search or add a
              new brand.
            </p>

          </div>
        ) : (
          <div className="brands-table-wrapper">

            <table className="brands-table">

              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Description</th>
                  <th>Products</th>
                  <th>Usage</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredBrands.map((brand) => {

                  const productCount =
                    brand.products?.length || 0;

                  const percentage =
                    totalProducts > 0
                      ? Math.round(
                          (productCount /
                            totalProducts) *
                            100
                        )
                      : 0;

                  const isUsed =
                    productCount > 0;

                  return (
                    <tr key={brand.id}>

                      <td>
                        <div className="brand-profile">

                          <div className="brand-avatar">
                            {brand.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {brand.name}
                            </strong>

                            <span>
                              ID: {brand.id}
                            </span>
                          </div>

                        </div>
                      </td>

                      <td>
                        <span className="brand-description">
                          {brand.description ||
                            "No description"}
                        </span>
                      </td>

                      <td>
                        <strong className="brand-product-count">
                          {productCount}
                        </strong>
                      </td>

                      <td>
                        <div className="brand-usage">

                          <div className="brand-usage-bar">
                            <div
                              className="brand-usage-fill"
                              style={{
                                width: `${percentage}%`,
                              }}
                            ></div>
                          </div>

                          <span>
                            {percentage}%
                          </span>

                        </div>
                      </td>

                      <td>
                        <span
                          className={`brand-status ${
                            isUsed
                              ? "active"
                              : "unused"
                          }`}
                        >
                          <span></span>

                          {isUsed
                            ? "Active"
                            : "Unused"}
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

    </div>
  );
};

export default Brands;

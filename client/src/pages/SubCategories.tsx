import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import api from "../services/axios";
import "./SubCategories.css";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
}

interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
  category: Category;
  products: Product[];
}

const SubCategories = () => {
  const [subCategories, setSubCategories] = useState<
    SubCategory[]
  >([]);

  const [categories, setCategories] = useState<
    Category[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("all");

  // =========================
  // FETCH DATA
  // =========================

  const fetchSubCategories = async () => {
    try {
      setLoading(true);

      const response = await api.get("/subcategories");
      setSubCategories(response.data);
      setError("");
    } catch (error) {
      console.error(
        "Error fetching subcategories:",
        error
      );

      setError(
        "Failed to load subcategories. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
     const response = await api.get("/categories");

      setCategories(response.data);
    } catch (error) {
      console.error(
        "Error fetching categories:",
        error
      );
    }
  };

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  // =========================
  // FILTER
  // =========================

  const filteredSubCategories = useMemo(() => {
    const search =
      searchTerm.toLowerCase().trim();

    return subCategories.filter((subCategory) => {
      const matchesSearch =
        !search ||
        subCategory.name
          .toLowerCase()
          .includes(search) ||
        subCategory.category.name
          .toLowerCase()
          .includes(search);

      const matchesCategory =
        categoryFilter === "all" ||
        String(subCategory.categoryId) ===
          categoryFilter;

      return (
        matchesSearch && matchesCategory
      );
    });
  }, [
    subCategories,
    searchTerm,
    categoryFilter,
  ]);

  // =========================
  // SUMMARY
  // =========================

  const totalProducts = subCategories.reduce(
    (total, subCategory) =>
      total +
      (subCategory.products?.length || 0),
    0
  );

  const usedSubCategories =
    subCategories.filter(
      (subCategory) =>
        (subCategory.products?.length || 0) > 0
    ).length;

  const emptySubCategories =
    subCategories.filter(
      (subCategory) =>
        (subCategory.products?.length || 0) === 0
    ).length;

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="subcategories-page">
        <div className="subcategories-loading">
          <div className="subcategories-spinner"></div>
          <p>Loading subcategories...</p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="subcategories-page">
        <div className="subcategories-error">

          <div className="subcategories-error-icon">
            !
          </div>

          <h2>
            Subcategories unavailable
          </h2>

          <p>{error}</p>

          <button
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="subcategories-page">

      {/* HEADER */}

      <div className="subcategories-header">

        <div>
          <div className="subcategories-breadcrumb">
            Dashboard / Subcategories
          </div>

          <h1>Subcategories</h1>

          <p>
            Organize products into more specific
            product groups.
          </p>
        </div>

      </div>

      {/* STATS */}

      <div className="subcategories-stats">

        <div className="subcategory-stat-card">

          <div className="subcategory-stat-icon purple">
            ▦
          </div>

          <div>
            <span>Total Subcategories</span>
            <strong>
              {subCategories.length}
            </strong>
          </div>

        </div>

        <div className="subcategory-stat-card">

          <div className="subcategory-stat-icon green">
            ✓
          </div>

          <div>
            <span>Used Subcategories</span>
            <strong>
              {usedSubCategories}
            </strong>
          </div>

        </div>

        <div className="subcategory-stat-card">

          <div className="subcategory-stat-icon blue">
            📦
          </div>

          <div>
            <span>Products Assigned</span>
            <strong>
              {totalProducts}
            </strong>
          </div>

        </div>

        <div className="subcategory-stat-card">

          <div className="subcategory-stat-icon orange">
            ○
          </div>

          <div>
            <span>Empty Subcategories</span>
            <strong>
              {emptySubCategories}
            </strong>
          </div>

        </div>

      </div>

      {/* LIST */}

      <div className="subcategories-list-card">

        <div className="subcategories-list-header">

          <div>
            <h2>Subcategory List</h2>

            <p>
              {filteredSubCategories.length} of{" "}
              {subCategories.length} subcategories
            </p>
          </div>

          <div className="subcategories-filters">

            <div className="subcategories-search">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search subcategories..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

            </div>

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value
                )
              }
            >
              <option value="all">
                All Categories
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>

          </div>

        </div>

        {filteredSubCategories.length === 0 ? (
          <div className="subcategories-empty">

            <div className="subcategories-empty-icon">
              ▦
            </div>

            <h3>
              No subcategories found
            </h3>

            <p>
              Try changing your search or
              category filter.
            </p>

          </div>
        ) : (
          <div className="subcategories-table-wrapper">

            <table className="subcategories-table">

              <thead>
                <tr>
                  <th>Subcategory</th>
                  <th>Parent Category</th>
                  <th>Products</th>
                  <th>Usage</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredSubCategories.map(
                  (subCategory) => {

                    const productCount =
                      subCategory.products
                        ?.length || 0;

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
                      <tr
                        key={subCategory.id}
                      >

                        {/* SUBCATEGORY */}

                        <td>

                          <div className="subcategory-profile">

                            <div className="subcategory-avatar">
                              {subCategory.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {
                                  subCategory.name
                                }
                              </strong>

                              <span>
                                ID:{" "}
                                {
                                  subCategory.id
                                }
                              </span>
                            </div>

                          </div>

                        </td>

                        {/* CATEGORY */}

                        <td>

                          <div className="parent-category">

                            <span className="parent-category-icon">
                              ▦
                            </span>

                            <span>
                              {
                                subCategory
                                  .category
                                  .name
                              }
                            </span>

                          </div>

                        </td>

                        {/* PRODUCT COUNT */}

                        <td>

                          <strong className="subcategory-product-count">
                            {productCount}
                          </strong>

                        </td>

                        {/* USAGE */}

                        <td>

                          <div className="subcategory-usage">

                            <div className="subcategory-usage-bar">

                              <div
                                className="subcategory-usage-fill"
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

                        {/* STATUS */}

                        <td>

                          <span
                            className={`subcategory-status ${
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
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default SubCategories;

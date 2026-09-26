import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Categories.css";

interface Product {
  id: number;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  isActive?: boolean;
  products: Product[];
}

const Categories = () => {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [categoryName, setCategoryName] =
    useState("");
  const [description, setDescription] =
    useState("");

  // =========================
  // FETCH CATEGORIES
  // =========================

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/categories"
      );

      setCategories(response.data);
      setError("");
    } catch (error) {
      console.error(
        "Error fetching categories:",
        error
      );

      setError(
        "Failed to load categories. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================
  // FILTER
  // =========================

  const filteredCategories = useMemo(() => {
    const search =
      searchTerm.toLowerCase().trim();

    if (!search) {
      return categories;
    }

    return categories.filter(
      (category) =>
        category.name
          .toLowerCase()
          .includes(search) ||
        (category.description || "")
          .toLowerCase()
          .includes(search)
    );
  }, [categories, searchTerm]);

  // =========================
  // SUMMARY
  // =========================

  const totalProducts = categories.reduce(
    (total, category) =>
      total + (category.products?.length || 0),
    0
  );

  const categoriesWithProducts =
    categories.filter(
      (category) =>
        (category.products?.length || 0) > 0
    ).length;

  const emptyCategories =
    categories.filter(
      (category) =>
        (category.products?.length || 0) === 0
    ).length;

  // =========================
  // CREATE CATEGORY
  // =========================

  const handleCreateCategory = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Please enter a category name.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/categories",
        {
          name: categoryName.trim(),
          description:
            description.trim() || null,
        }
      );

      alert(
        "Category created successfully!"
      );

      setCategoryName("");
      setDescription("");
      setShowForm(false);

      await fetchCategories();
    } catch (error) {
      console.error(
        "Error creating category:",
        error
      );

      alert(
        "Failed to create category. The category name may already exist."
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="categories-page">
        <div className="categories-loading">
          <div className="categories-spinner"></div>
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="categories-page">
        <div className="categories-error">

          <div className="categories-error-icon">
            !
          </div>

          <h2>
            Categories unavailable
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
    <div className="categories-page">

      {/* HEADER */}

      <div className="categories-header">

        <div>
          <div className="categories-breadcrumb">
            Dashboard / Categories
          </div>

          <h1>Categories</h1>

          <p>
            Organize your products into
            meaningful categories.
          </p>
        </div>

        <button
          className="category-add-button"
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          <span>+</span>
          Add Category
        </button>

      </div>

      {/* STATS */}

      <div className="categories-stats">

        <div className="category-stat-card">

          <div className="category-stat-icon purple">
            ▦
          </div>

          <div>
            <span>Total Categories</span>
            <strong>
              {categories.length}
            </strong>
          </div>

        </div>

        <div className="category-stat-card">

          <div className="category-stat-icon green">
            ✓
          </div>

          <div>
            <span>With Products</span>
            <strong>
              {categoriesWithProducts}
            </strong>
          </div>

        </div>

        <div className="category-stat-card">

          <div className="category-stat-icon blue">
            📦
          </div>

          <div>
            <span>Total Products</span>
            <strong>
              {totalProducts}
            </strong>
          </div>

        </div>

        <div className="category-stat-card">

          <div className="category-stat-icon orange">
            ○
          </div>

          <div>
            <span>Empty Categories</span>
            <strong>
              {emptyCategories}
            </strong>
          </div>

        </div>

      </div>

      {/* ADD CATEGORY FORM */}

      {showForm && (
        <div className="category-form-card">

          <div className="category-form-header">

            <div>
              <h2>Add New Category</h2>

              <p>
                Enter the category information
                below.
              </p>
            </div>

            <button
              className="category-close-button"
              onClick={() =>
                setShowForm(false)
              }
            >
              ×
            </button>

          </div>

          <form
            className="category-form"
            onSubmit={
              handleCreateCategory
            }
          >

            <div className="category-form-grid">

              <div className="category-form-group">
                <label>
                  Category Name *
                </label>

                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) =>
                    setCategoryName(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Electronics"
                />
              </div>

              <div className="category-form-group">
                <label>
                  Description
                </label>

                <input
                  type="text"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Short category description"
                />
              </div>

            </div>

            <div className="category-form-actions">

              <button
                type="button"
                className="category-cancel-button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="category-save-button"
              >
                Create Category
              </button>

            </div>

          </form>

        </div>
      )}

      {/* CATEGORY LIST */}

      <div className="categories-list-card">

        <div className="categories-list-header">

          <div>
            <h2>Category List</h2>

            <p>
              {filteredCategories.length} of{" "}
              {categories.length} categories
            </p>
          </div>

          <div className="categories-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        {filteredCategories.length === 0 ? (
          <div className="categories-empty">

            <div className="categories-empty-icon">
              ▦
            </div>

            <h3>
              No categories found
            </h3>

            <p>
              Try changing your search or
              create a new category.
            </p>

          </div>
        ) : (
          <div className="categories-table-wrapper">

            <table className="categories-table">

              <thead>
                <tr>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Products</th>
                  <th>Usage</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredCategories.map(
                  (category) => {

                    const productCount =
                      category.products?.length ||
                      0;

                    return (
                      <tr
                        key={category.id}
                      >

                        <td>

                          <div className="category-profile">

                            <div className="category-avatar">
                              {category.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {
                                  category.name
                                }
                              </strong>

                              <span>
                                ID:{" "}
                                {category.id}
                              </span>
                            </div>

                          </div>

                        </td>

                        <td>
                          <span className="category-description">
                            {category.description ||
                              "No description"}
                          </span>
                        </td>

                        <td>
                          <strong className="category-product-count">
                            {productCount}
                          </strong>
                        </td>

                        <td>

                          <div className="category-usage">

                            <div className="usage-bar">
                              <div
                                className="usage-fill"
                                style={{
                                  width: `${
                                    totalProducts > 0
                                      ? Math.min(
                                          (productCount /
                                            totalProducts) *
                                            100,
                                          100
                                        )
                                      : 0
                                  }%`,
                                }}
                              ></div>
                            </div>

                            <span>
                              {totalProducts > 0
                                ? Math.round(
                                    (productCount /
                                      totalProducts) *
                                      100
                                  )
                                : 0}
                              %
                            </span>

                          </div>

                        </td>

                        <td>

                          <span
                            className={`category-status ${
                              category.isActive ===
                                false ||
                              productCount === 0
                                ? "inactive"
                                : "active"
                            }`}
                          >
                            <span></span>

                            {category.isActive ===
                              false
                              ? "Inactive"
                              : productCount === 0
                              ? "Unused"
                              : "Active"}
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

export default Categories;

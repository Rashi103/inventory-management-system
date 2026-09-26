import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Products.css";

interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface Inventory {
  id: number;
  quantity: number;
  batchNumber: string;
  expiryDate: string | null;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  price: string | number;
  costPrice: string | number;
  unit: string;
  categoryId: number;
  subCategoryId: number | null;
  brandId: number | null;
  isActive: boolean;
  category: Category;
  subCategory: SubCategory | null;
  brand: Brand | null;
  inventories?: Inventory[];
}

interface ProductForm {
  name: string;
  sku: string;
  description: string;
  price: string;
  costPrice: string;
  unit: string;
  categoryId: string;
  subCategoryId: string;
  brandId: string;
}

const emptyForm: ProductForm = {
  name: "",
  sku: "",
  description: "",
  price: "",
  costPrice: "",
  unit: "piece",
  categoryId: "",
  subCategoryId: "",
  brandId: "",
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>(
    []
  );

  const [categories, setCategories] = useState<
    Category[]
  >([]);

  const [subCategories, setSubCategories] =
    useState<SubCategory[]>([]);

  const [brands, setBrands] = useState<Brand[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [showForm, setShowForm] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [form, setForm] =
    useState<ProductForm>(emptyForm);

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(response.data);
      setError("");
    } catch (error) {
      console.error(
        "Error fetching products:",
        error
      );

      setError(
        "Failed to load products. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH CATEGORIES
  // =========================

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/categories"
      );

      setCategories(response.data);
    } catch (error) {
      console.error(
        "Error fetching categories:",
        error
      );
    }
  };

  // =========================
  // FETCH SUBCATEGORIES
  // =========================

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/subcategories"
      );

      setSubCategories(response.data);
    } catch (error) {
      console.error(
        "Error fetching subcategories:",
        error
      );
    }
  };

  // =========================
  // FETCH BRANDS
  // =========================

  const fetchBrands = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/brands"
      );

      setBrands(response.data);
    } catch (error) {
      console.error(
        "Error fetching brands:",
        error
      );
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubCategories();
    fetchBrands();
  }, []);

  // =========================
  // PRODUCT STOCK
  // =========================

  const getProductStock = (
    product: Product
  ) => {
    return (
      product.inventories?.reduce(
        (total, inventory) =>
          total + Number(inventory.quantity || 0),
        0
      ) || 0
    );
  };

  // =========================
  // STOCK STATUS
  // =========================

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        className: "out",
      };
    }

    if (stock <= 10) {
      return {
        label: "Low Stock",
        className: "low",
      };
    }

    return {
      label: "In Stock",
      className: "in",
    };
  };

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const search =
        searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        product.name
          .toLowerCase()
          .includes(search) ||
        product.sku
          .toLowerCase()
          .includes(search) ||
        product.category.name
          .toLowerCase()
          .includes(search);

      const matchesCategory =
        categoryFilter === "all" ||
        String(product.categoryId) ===
          categoryFilter;

      const stock = getProductStock(product);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "in" &&
          stock > 10) ||
        (statusFilter === "low" &&
          stock > 0 &&
          stock <= 10) ||
        (statusFilter === "out" &&
          stock === 0);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    products,
    searchTerm,
    categoryFilter,
    statusFilter,
  ]);

  // =========================
  // SUMMARY
  // =========================

  const activeProducts = products.filter(
    (product) => product.isActive
  ).length;

  const lowStockCount = products.filter(
    (product) => {
      const stock =
        getProductStock(product);

      return stock > 0 && stock <= 10;
    }
  ).length;

  const outOfStockCount = products.filter(
    (product) =>
      getProductStock(product) === 0
  ).length;

  // =========================
  // FORM HANDLER
  // =========================

  const handleInputChange = (
    field: keyof ProductForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setForm(emptyForm);
    setEditingProduct(null);
    setShowForm(false);
  };

  // =========================
  // ADD PRODUCT
  // =========================

  const handleAddProduct = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  // =========================
  // EDIT PRODUCT
  // =========================

  const handleEditProduct = (
    product: Product
  ) => {
    setEditingProduct(product);

    setForm({
      name: product.name,
      sku: product.sku,
      description:
        product.description || "",
      price: String(product.price),
      costPrice: String(product.costPrice),
      unit: product.unit,
      categoryId: String(
        product.categoryId
      ),
      subCategoryId:
        product.subCategoryId
          ? String(product.subCategoryId)
          : "",
      brandId: product.brandId
        ? String(product.brandId)
        : "",
    });

    setShowForm(true);
  };

  // =========================
  // SUBMIT PRODUCT
  // =========================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!form.sku.trim()) {
      alert("Please enter product SKU.");
      return;
    }

    if (!form.price) {
      alert("Please enter selling price.");
      return;
    }

    if (!form.costPrice) {
      alert("Please enter cost price.");
      return;
    }

    if (!form.categoryId) {
      alert("Please select a category.");
      return;
    }

    try {
      const productData = {
        name: form.name.trim(),
        sku: form.sku.trim(),
        description:
          form.description.trim() || null,
        price: Number(form.price),
        costPrice: Number(form.costPrice),
        unit: form.unit,
        categoryId: Number(
          form.categoryId
        ),
        subCategoryId:
          form.subCategoryId
            ? Number(form.subCategoryId)
            : null,
        brandId: form.brandId
          ? Number(form.brandId)
          : null,
      };

      if (editingProduct) {
        await axios.put(
          `http://localhost:5000/api/products/${editingProduct.id}`,
          productData
        );

        alert(
          "Product updated successfully!"
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/products",
          productData
        );

        alert(
          "Product added successfully!"
        );
      }

      await fetchProducts();
      resetForm();
    } catch (error) {
      console.error(
        "Error saving product:",
        error
      );

      if (axios.isAxiosError(error)) {
        if (
          error.response?.status === 500
        ) {
          alert(
            "Could not save product. The SKU may already exist."
          );
        } else {
          alert(
            "Failed to save product. Please try again."
          );
        }
      } else {
        alert(
          "Failed to save product."
        );
      }
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="products-page">
        <div className="products-loading">
          <div className="products-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="products-page">
        <div className="products-error">
          <div className="products-error-icon">
            !
          </div>

          <h2>
            Products unavailable
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

  // =========================
  // UI
  // =========================

  return (
    <div className="products-page">

      {/* HEADER */}

      <div className="products-header">

        <div>
          <div className="products-breadcrumb">
            Dashboard / Products
          </div>

          <h1>Products</h1>

          <p>
            Manage your product catalog,
            pricing and stock information.
          </p>
        </div>

        <button
          className="products-add-button"
          onClick={handleAddProduct}
        >
          <span>+</span>
          Add Product
        </button>

      </div>

      {/* STATS */}

      <div className="products-stats">

        <div className="product-stat-card">
          <div className="product-stat-icon purple">
            📦
          </div>

          <div>
            <span>Total Products</span>
            <strong>
              {products.length}
            </strong>
          </div>
        </div>

        <div className="product-stat-card">
          <div className="product-stat-icon green">
            ✓
          </div>

          <div>
            <span>Active Products</span>
            <strong>
              {activeProducts}
            </strong>
          </div>
        </div>

        <div className="product-stat-card">
          <div className="product-stat-icon orange">
            ⚠
          </div>

          <div>
            <span>Low Stock</span>
            <strong>
              {lowStockCount}
            </strong>
          </div>
        </div>

        <div className="product-stat-card">
          <div className="product-stat-icon red">
            !
          </div>

          <div>
            <span>Out of Stock</span>
            <strong>
              {outOfStockCount}
            </strong>
          </div>
        </div>

      </div>

      {/* ADD / EDIT FORM */}

      {showForm && (
        <div className="product-form-card">

          <div className="product-form-header">

            <div>
              <h2>
                {editingProduct
                  ? "Edit Product"
                  : "Add New Product"}
              </h2>

              <p>
                {editingProduct
                  ? "Update product information below."
                  : "Enter the product information below."}
              </p>
            </div>

            <button
              type="button"
              className="product-close-button"
              onClick={resetForm}
            >
              ×
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="product-form"
          >

            <div className="product-form-grid">

              <div className="product-form-group">
                <label>
                  Product Name *
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    handleInputChange(
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Enter product name"
                />
              </div>

              <div className="product-form-group">
                <label>SKU *</label>

                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) =>
                    handleInputChange(
                      "sku",
                      e.target.value
                    )
                  }
                  placeholder="e.g. TEA-001"
                />
              </div>

              <div className="product-form-group">
                <label>
                  Selling Price *
                </label>

                <div className="input-with-prefix">
                  <span>₹</span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      handleInputChange(
                        "price",
                        e.target.value
                      )
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="product-form-group">
                <label>
                  Cost Price *
                </label>

                <div className="input-with-prefix">
                  <span>₹</span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.costPrice}
                    onChange={(e) =>
                      handleInputChange(
                        "costPrice",
                        e.target.value
                      )
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="product-form-group">
                <label>Unit</label>

                <select
                  value={form.unit}
                  onChange={(e) =>
                    handleInputChange(
                      "unit",
                      e.target.value
                    )
                  }
                >
                  <option value="piece">
                    Piece
                  </option>
                  <option value="packet">
                    Packet
                  </option>
                  <option value="box">
                    Box
                  </option>
                  <option value="kg">
                    Kilogram
                  </option>
                  <option value="gram">
                    Gram
                  </option>
                  <option value="liter">
                    Liter
                  </option>
                  <option value="ml">
                    Milliliter
                  </option>
                  <option value="bottle">
                    Bottle
                  </option>
                </select>
              </div>

              <div className="product-form-group">
                <label>Category *</label>

                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    handleInputChange(
                      "categoryId",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="product-form-group">
                <label>
                  Subcategory
                </label>

                <select
                  value={form.subCategoryId}
                  onChange={(e) =>
                    handleInputChange(
                      "subCategoryId",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select subcategory
                  </option>

                  {subCategories
                    .filter(
                      (subCategory) =>
                        !form.categoryId ||
                        true
                    )
                    .map(
                      (subCategory) => (
                        <option
                          key={
                            subCategory.id
                          }
                          value={
                            subCategory.id
                          }
                        >
                          {subCategory.name}
                        </option>
                      )
                    )}
                </select>
              </div>

              <div className="product-form-group">
                <label>Brand</label>

                <select
                  value={form.brandId}
                  onChange={(e) =>
                    handleInputChange(
                      "brandId",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select brand
                  </option>

                  {brands.map((brand) => (
                    <option
                      key={brand.id}
                      value={brand.id}
                    >
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="product-form-group product-description-group">
                <label>Description</label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    handleInputChange(
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

            </div>

            <div className="product-form-actions">

              <button
                type="button"
                className="product-cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="product-save-button"
              >
                {editingProduct
                  ? "Update Product"
                  : "Add Product"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* PRODUCT LIST */}

      <div className="products-list-card">

        <div className="products-list-header">

          <div>
            <h2>Product Catalog</h2>

            <p>
              {filteredProducts.length} of{" "}
              {products.length} products
            </p>
          </div>

          <div className="products-filters">

            <div className="products-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search products..."
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

              {categories.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >
              <option value="all">
                All Status
              </option>

              <option value="in">
                In Stock
              </option>

              <option value="low">
                Low Stock
              </option>

              <option value="out">
                Out of Stock
              </option>
            </select>

          </div>

        </div>

        {filteredProducts.length === 0 ? (
          <div className="products-empty">

            <div className="products-empty-icon">
              📦
            </div>

            <h3>
              No products found
            </h3>

            <p>
              Try changing your search or
              filters.
            </p>

          </div>
        ) : (
          <div className="products-table-wrapper">

            <table className="products-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredProducts.map(
                  (product) => {
                    const stock =
                      getProductStock(
                        product
                      );

                    const stockStatus =
                      getStockStatus(
                        stock
                      );

                    return (
                      <tr
                        key={product.id}
                      >

                        <td>
                          <div className="product-profile">

                            <div className="product-avatar">
                              {product.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {product.name}
                              </strong>

                              <span>
                                {product.unit}
                              </span>
                            </div>

                          </div>
                        </td>

                        <td>
                          <span className="product-sku">
                            {product.sku}
                          </span>
                        </td>

                        <td>
                          <span className="category-badge">
                            {
                              product
                                .category
                                .name
                            }
                          </span>
                        </td>

                        <td>
                          <span className="brand-name">
                            {product.brand
                              ?.name ||
                              "—"}
                          </span>
                        </td>

                        <td>
                          <strong className="product-price">
                            ₹
                            {Number(
                              product.price
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </td>

                        <td>
                          <div className="product-stock">
                            <strong>
                              {stock}
                            </strong>

                            <span>
                              {product.unit}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`product-status ${stockStatus.className}`}
                          >
                            <span></span>
                            {
                              stockStatus.label
                            }
                          </span>
                        </td>

                        <td>
                          <button
                            className="product-edit-button"
                            onClick={() =>
                              handleEditProduct(
                                product
                              )
                            }
                          >
                            Edit
                          </button>
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

export default Products;
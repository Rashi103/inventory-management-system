import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: string;
  category: {
    id: number;
    name: string;
  };
  inventories: {
    quantity: number;
  }[];
}

interface Category {
  id: number;
  name: string;
}

function Products() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/products"),
          axios.get("http://localhost:5000/api/categories"),
        ]);

        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load products or categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStock = (product: Product) => {
    return product.inventories.reduce(
      (total, inventory) => total + inventory.quantity,
      0
    );
  };

  const getStatus = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 10) return "Low Stock";
    return "In Stock";
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      product.category.id.toString() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="products-page">Loading products...</div>;
  }

  if (error) {
    return <div className="products-page">{error}</div>;
  }

  return (
    <div className="products-page">
      <div className="page-heading">
        <div>
          <h2>Products</h2>
          <p>Manage your products and product information.</p>
        </div>

        <button className="add-product-btn">
          + Add Product
        </button>
      </div>

      <div className="products-card">
        <div className="products-toolbar">
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => {
                const stock = getStock(product);
                const status = getStatus(stock);

                return (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                    </td>

                    <td>{product.sku}</td>

                    <td>{product.category.name}</td>

                    <td>
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </td>

                    <td>{stock}</td>

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
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="no-products">
                    No products found.
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

export default Products;


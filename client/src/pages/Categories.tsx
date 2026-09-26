import { useEffect, useState } from "react";
import axios from "axios";

interface Category {
  id: number;
  name: string;
  description: string | null;
  products: {
    id: number;
  }[];
}

function Categories() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/categories"
        );

        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="categories-page">Loading categories...</div>;
  }

  if (error) {
    return <div className="categories-page">{error}</div>;
  }

  return (
    <div className="categories-page">
      <div className="page-heading">
        <div>
          <h2>Categories</h2>
          <p>Manage product categories and organize your inventory.</p>
        </div>

        <button className="add-product-btn">
          + Add Category
        </button>
      </div>

      <div className="products-card">
        <div className="products-toolbar">
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Products</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <strong>{category.name}</strong>
                  </td>

                  <td>{category.description || "—"}</td>

                  <td>{category.products.length}</td>

                  <td>
                    <span className="status-badge in-stock">
                      Active
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn">Edit</button>
                      <button className="delete-btn">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={5} className="no-products">
                    No categories found.
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

export default Categories;


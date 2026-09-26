
import { useEffect, useState } from "react";
import axios from "axios";

interface SubCategory {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  };
  products: {
    id: number;
  }[];
}

function SubCategories() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/subcategories"
        );

        setSubCategories(response.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setError("Failed to load subcategories.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, []);

  const filteredSubCategories = subCategories.filter((subCategory) => {
    const matchesSearch =
      subCategory.name.toLowerCase().includes(search.toLowerCase()) ||
      subCategory.category.name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      subCategory.category.id.toString() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="categories-page">
        Loading subcategories...
      </div>
    );
  }

  if (error) {
    return <div className="categories-page">{error}</div>;
  }

  return (
    <div className="categories-page">
      <div className="page-heading">
        <div>
          <h2>Subcategories</h2>
          <p>Manage subcategories within your product categories.</p>
        </div>

        <button className="add-product-btn">
          + Add Subcategory
        </button>
      </div>

      <div className="products-card">
        <div className="products-toolbar">
          <input
            type="text"
            placeholder="Search subcategories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="3">Beverages</option>
            <option value="4">Groceries</option>
            <option value="5">Household</option>
            <option value="6">Personal Care</option>
          </select>
        </div>

        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Subcategory</th>
                <th>Category</th>
                <th>Products</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSubCategories.map((subCategory) => (
                <tr key={subCategory.id}>
                  <td>
                    <strong>{subCategory.name}</strong>
                  </td>

                  <td>{subCategory.category.name}</td>

                  <td>{subCategory.products.length}</td>

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

              {filteredSubCategories.length === 0 && (
                <tr>
                  <td colSpan={5} className="no-products">
                    No subcategories found.
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

export default SubCategories;



import { useEffect, useState } from "react";
import axios from "axios";

interface Brand {
  id: number;
  name: string;
  description: string | null;
  products: { id: number }[];
}

function Brands() {
  const [search, setSearch] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/brands"
        );

        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setError("Failed to load brands.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="categories-page">Loading brands...</div>;
  }

  if (error) {
    return <div className="categories-page">{error}</div>;
  }

  return (
    <div className="categories-page">
      <div className="page-heading">
        <div>
          <h2>Brands</h2>
          <p>Manage product brands and their information.</p>
        </div>

        <button className="add-product-btn">
          + Add Brand
        </button>
      </div>

      <div className="products-card">
        <div className="products-toolbar">
          <input
            type="text"
            placeholder="Search brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Description</th>
                <th>Products</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBrands.map((brand) => (
                <tr key={brand.id}>
                  <td>
                    <strong>{brand.name}</strong>
                  </td>

                  <td>
                    {brand.description || "—"}
                  </td>

                  <td>
                    {brand.products.length}
                  </td>

                  <td>
                    <span className="status-badge in-stock">
                      Active
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn">
                        Edit
                      </button>

                      <button className="delete-btn">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredBrands.length === 0 && (
                <tr>
                  <td colSpan={5} className="no-products">
                    No brands found.
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

export default Brands;

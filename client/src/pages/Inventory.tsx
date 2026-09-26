
import { useEffect, useState } from "react";
import axios from "axios";

interface InventoryItem {
  id: number;
  batchNumber: string;
  quantity: number;
  expiryDate: string | null;
  product: {
    id: number;
    name: string;
    sku: string;
  };
  warehouse: {
    id: number;
    name: string;
  };
}

interface Warehouse {
  id: number;
  name: string;
}

function Inventory() {
  const [search, setSearch] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryResponse, warehouseResponse] =
          await Promise.all([
            axios.get("http://localhost:5000/api/inventory"),
            axios.get("http://localhost:5000/api/warehouses"),
          ]);

        setInventory(inventoryResponse.data);
        setWarehouses(warehouseResponse.data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setError("Failed to load inventory.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatus = (item: InventoryItem) => {
    if (
      item.expiryDate &&
      new Date(item.expiryDate) < new Date()
    ) {
      return "Expired";
    }

    if (item.quantity === 0) {
      return "Out of Stock";
    }

    if (item.quantity <= 10) {
      return "Low Stock";
    }

    return "In Stock";
  };

  const filteredInventory = inventory.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.product.name.toLowerCase().includes(searchText) ||
      item.product.sku.toLowerCase().includes(searchText) ||
      item.batchNumber.toLowerCase().includes(searchText) ||
      item.warehouse.name.toLowerCase().includes(searchText);

    const matchesWarehouse =
      selectedWarehouse === "" ||
      item.warehouse.id.toString() === selectedWarehouse;

    return matchesSearch && matchesWarehouse;
  });

  if (loading) {
    return (
      <div className="inventory-page">
        Loading inventory...
      </div>
    );
  }

  if (error) {
    return (
      <div className="inventory-page">
        {error}
      </div>
    );
  }

  return (
    <div className="inventory-page">
      <div className="page-heading">
        <div>
          <h2>Inventory</h2>
          <p>
            Track product stock, batches, warehouses and expiry dates.
          </p>
        </div>

        <button className="add-product-btn">
          + Add Stock
        </button>
      </div>

      <div className="products-card">
        <div className="products-toolbar">
          <input
            type="text"
            placeholder="Search product, SKU, batch or warehouse..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={selectedWarehouse}
            onChange={(e) =>
              setSelectedWarehouse(e.target.value)
            }
          >
            <option value="">All Warehouses</option>

            {warehouses.map((warehouse) => (
              <option
                key={warehouse.id}
                value={warehouse.id}
              >
                {warehouse.name}
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
                <th>Warehouse</th>
                <th>Batch Number</th>
                <th>Quantity</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredInventory.map((item) => {
                const status = getStatus(item);

                return (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.product.name}</strong>
                    </td>

                    <td>{item.product.sku}</td>

                    <td>{item.warehouse.name}</td>

                    <td>{item.batchNumber}</td>

                    <td>{item.quantity}</td>

                    <td>
                      {item.expiryDate
                        ? new Date(
                            item.expiryDate
                          ).toLocaleDateString("en-IN")
                        : "—"}
                    </td>

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
                        <button className="edit-btn">
                          Edit
                        </button>

                        <button className="delete-btn">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredInventory.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="no-products"
                  >
                    No inventory records found.
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

export default Inventory;


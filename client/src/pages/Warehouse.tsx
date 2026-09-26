import { useState } from "react";

interface Warehouse {
  id: number;
  name: string;
  location: string;
  manager: string;
  contact: string;
  capacity: number;
  status: "Active" | "Inactive";
}

function Warehouse() {
  const [search, setSearch] = useState("");

  const warehouses: Warehouse[] = [
    {
      id: 1,
      name: "Main Warehouse",
      location: "Bhopal",
      manager: "Rahul Sharma",
      contact: "9876543210",
      capacity: 1000,
      status: "Active",
    },
    {
      id: 2,
      name: "Secondary Warehouse",
      location: "Indore",
      manager: "Amit Verma",
      contact: "9876501234",
      capacity: 750,
      status: "Active",
    },
    {
      id: 3,
      name: "Old Warehouse",
      location: "Jabalpur",
      manager: "Priya Singh",
      contact: "9988776655",
      capacity: 500,
      status: "Inactive",
    },
  ];

  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(search.toLowerCase()) ||
      warehouse.location.toLowerCase().includes(search.toLowerCase()) ||
      warehouse.manager.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="warehouse-page">
      <div className="page-heading">
        <div>
          <h2>Warehouses</h2>
          <p>Manage your warehouses and storage locations.</p>
        </div>

        <button className="add-product-btn">
          + Add Warehouse
        </button>
      </div>

      <div className="products-card">
        <div className="products-toolbar">
          <input
            type="text"
            placeholder="Search warehouses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Warehouse</th>
                <th>Location</th>
                <th>Manager</th>
                <th>Contact</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredWarehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td>
                    <strong>{warehouse.name}</strong>
                  </td>

                  <td>{warehouse.location}</td>
                  <td>{warehouse.manager}</td>
                  <td>{warehouse.contact}</td>
                  <td>{warehouse.capacity} units</td>

                  <td>
                    <span
                      className={`status-badge ${
                        warehouse.status === "Active"
                          ? "in-stock"
                          : "out-of-stock"
                      }`}
                    >
                      {warehouse.status}
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

              {filteredWarehouses.length === 0 && (
                <tr>
                  <td colSpan={7} className="no-products">
                    No warehouses found.
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

export default Warehouse;
import { useState } from "react";

interface Employee {
  id: number;
  name: string;
  employeeCode: string;
  role: string;
  phone: string;
  email: string;
  joiningDate: string;
  status: "Active" | "Inactive";
}

function Employees() {
  const [search, setSearch] = useState("");

  const employees: Employee[] = [
    {
      id: 1,
      name: "Rahul Sharma",
      employeeCode: "EMP-001",
      role: "Manager",
      phone: "9876543210",
      email: "rahul@inventory.com",
      joiningDate: "2025-06-15",
      status: "Active",
    },
    {
      id: 2,
      name: "Priya Singh",
      employeeCode: "EMP-002",
      role: "Sales Executive",
      phone: "9988776655",
      email: "priya@inventory.com",
      joiningDate: "2025-08-10",
      status: "Active",
    },
    {
      id: 3,
      name: "Amit Verma",
      employeeCode: "EMP-003",
      role: "Inventory Staff",
      phone: "9876501234",
      email: "amit@inventory.com",
      joiningDate: "2026-01-20",
      status: "Active",
    },
    {
      id: 4,
      name: "Neha Gupta",
      employeeCode: "EMP-004",
      role: "Accountant",
      phone: "9123456789",
      email: "neha@inventory.com",
      joiningDate: "2025-03-05",
      status: "Inactive",
    },
  ];

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.employeeCode
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      employee.role.toLowerCase().includes(search.toLowerCase()) ||
      employee.phone.includes(search)
  );

  return (
    <div className="employees-page">
      <div className="page-heading">
        <div>
          <h2>Employees</h2>
          <p>Manage employees and their roles in the system.</p>
        </div>

        <button className="add-product-btn">
          + Add Employee
        </button>
      </div>

      <div className="products-card">
        <div className="products-toolbar">
          <input
            type="text"
            placeholder="Search by name, employee code, role or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select>
            <option value="">All Roles</option>
            <option value="Manager">Manager</option>
            <option value="Sales Executive">Sales Executive</option>
            <option value="Inventory Staff">Inventory Staff</option>
            <option value="Accountant">Accountant</option>
          </select>
        </div>

        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee Code</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Joining Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <strong>{employee.name}</strong>
                  </td>

                  <td>{employee.employeeCode}</td>

                  <td>{employee.role}</td>

                  <td>{employee.phone}</td>

                  <td>{employee.email}</td>

                  <td>{employee.joiningDate}</td>

                  <td>
                    <span
                      className={`status-badge ${
                        employee.status === "Active"
                          ? "in-stock"
                          : "out-of-stock"
                      }`}
                    >
                      {employee.status}
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

              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={8} className="no-products">
                    No employees found.
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

export default Employees;
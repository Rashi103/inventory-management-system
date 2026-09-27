import { useEffect, useState } from "react";
import axios from "axios";
import "./Employees.css";
import api from "../services/axios";

interface Role {
  id: number;
  name: string;
}

interface UserLogin {
  id: number;
  username: string;
  isActive: boolean;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  roleId: number;
  isActive: boolean;
  role: Role;
  userLogin: UserLogin | null;
}

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [roleId, setRoleId] = useState("");

  // =========================
  // FETCH EMPLOYEES
  // =========================

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const response = await api.get("/employees");

      setEmployees(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH ROLES
  // =========================

  const fetchRoles = async () => {
    try {
      const response = await api.get("/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, []);

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setRoleId("");
    setEditingEmployee(null);
    setShowForm(false);
  };

  // =========================
  // ADD / UPDATE EMPLOYEE
  // =========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter employee name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter employee email.");
      return;
    }

    if (!roleId) {
      alert("Please select an employee role.");
      return;
    }

    try {
      if (editingEmployee) {
        // UPDATE EMPLOYEE

        await api.post("/employees", {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          address: address.trim() || null,
          roleId: Number(roleId),
        });

        alert("Employee updated successfully!");
      } else {
        // CREATE EMPLOYEE

        await axios.post("http://localhost:5000/api/employees", {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          address: address.trim() || null,
          roleId: Number(roleId),
        });

        alert("Employee added successfully!");
      }

      await fetchEmployees();

      resetForm();
    } catch (error) {
      console.error("Error saving employee:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 500) {
          alert("Could not save employee. The email may already exist.");
        } else {
          alert("Failed to save employee. Please try again.");
        }
      } else {
        alert("Failed to save employee.");
      }
    }
  };

  // =========================
  // EDIT EMPLOYEE
  // =========================

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);

    setName(employee.name);
    setEmail(employee.email);
    setPhone(employee.phone ?? "");
    setAddress(employee.address ?? "");
    setRoleId(String(employee.roleId));

    setShowForm(true);
  };

  const handleToggleStatus = async (employee: Employee) => {
    const action = employee.isActive ? "deactivate" : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${employee.name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.patch(`/employees/${employee.id}/status`);

      await fetchEmployees();

      alert(`Employee ${action}d successfully!`);
    } catch (error) {
      console.error("Error changing employee status:", error);

      alert("Failed to change employee status. Please try again.");
    }
  };
  // =========================
  // SEARCH
  // =========================

  const filteredEmployees = employees.filter((employee) => {
    const search = searchTerm.toLowerCase();

    return (
      employee.name.toLowerCase().includes(search) ||
      employee.email.toLowerCase().includes(search) ||
      employee.role.name.toLowerCase().includes(search)
    );
  });

  // =========================
  // SUMMARY
  // =========================

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => employee.isActive,
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => !employee.isActive,
  ).length;

  const employeesWithLogin = employees.filter(
    (employee) => employee.userLogin && employee.userLogin.isActive,
  ).length;

  // =========================
  // INITIALS
  // =========================

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="employees-page">
      {/* HEADER */}

      <div className="employees-header">
        <div>
          <div className="employees-breadcrumb">Dashboard / Employees</div>

          <h1>Employees</h1>

          <p>Manage your employees and their system access.</p>
        </div>

        <button
          className="employees-add-button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Employee
        </button>
      </div>

      {/* STATS */}

      <div className="employee-stats">
        <div className="employee-stat-card">
          <div className="employee-stat-icon">👥</div>

          <div>
            <span>Total Employees</span>
            <strong>{totalEmployees}</strong>
          </div>
        </div>

        <div className="employee-stat-card">
          <div className="employee-stat-icon">✓</div>

          <div>
            <span>Active Employees</span>
            <strong>{activeEmployees}</strong>
          </div>
        </div>

        <div className="employee-stat-card">
          <div className="employee-stat-icon">○</div>

          <div>
            <span>Inactive Employees</span>
            <strong>{inactiveEmployees}</strong>
          </div>
        </div>

        <div className="employee-stat-card">
          <div className="employee-stat-icon">🔐</div>

          <div>
            <span>With Login Access</span>
            <strong>{employeesWithLogin}</strong>
          </div>
        </div>
      </div>

      {/* ADD / EDIT FORM */}

      {showForm && (
        <div className="employee-form-card">
          <div className="employee-form-header">
            <div>
              <h2>{editingEmployee ? "Edit Employee" : "Add New Employee"}</h2>

              <p>
                {editingEmployee
                  ? "Update the employee's information below."
                  : "Enter the employee's information below."}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="employee-form">
            <div className="employee-form-grid">
              <div className="employee-form-group">
                <label>Employee Name *</label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter employee name"
                />
              </div>

              <div className="employee-form-group">
                <label>Email *</label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>

              <div className="employee-form-group">
                <label>Phone</label>

                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="employee-form-group">
                <label>Role *</label>

                <select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                >
                  <option value="">Select employee role</option>

                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="employee-form-group employee-address-group">
                <label>Address</label>

                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter employee address"
                />
              </div>
            </div>

            <div className="employee-form-actions">
              <button
                type="button"
                className="employee-cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button type="submit" className="employee-submit-button">
                {editingEmployee ? "Update Employee" : "Add Employee"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EMPLOYEE LIST */}

      <div className="employee-list-card">
        <div className="employee-list-header">
          <div>
            <h2>Employee Directory</h2>

            <p>{filteredEmployees.length} employees found</p>
          </div>

          <div className="employee-search">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="employee-loading">Loading employees...</div>
        ) : error ? (
          <div className="employee-error">{error}</div>
        ) : filteredEmployees.length === 0 ? (
          <div className="employee-empty">
            <h3>No employees found</h3>
            <p>Try changing your search or add a new employee.</p>
          </div>
        ) : (
          <div className="employee-table-wrapper">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Login Access</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="employee-profile">
                        <div className="employee-avatar">
                          {getInitials(employee.name)}
                        </div>

                        <div>
                          <strong>{employee.name}</strong>

                          <span>
                            EMP-
                            {String(employee.id).padStart(3, "0")}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="employee-contact">
                        <span>{employee.email}</span>

                        <small>{employee.phone || "No phone"}</small>
                      </div>
                    </td>

                    <td>
                      <span className="employee-role">
                        {employee.role.name}
                      </span>
                    </td>

                    <td>
                      <div className="login-info">
                        <span
                          className={
                            employee.userLogin
                              ? "login-dot active"
                              : "login-dot"
                          }
                        />

                        {employee.userLogin ? "Enabled" : "No Access"}
                      </div>
                    </td>

                    <td>
                      <span
                        className={
                          employee.isActive
                            ? "employee-status active"
                            : "employee-status inactive"
                        }
                      >
                        {employee.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="employee-action-wrapper">
                        <button
                          className="employee-action-button"
                          onClick={() => handleEdit(employee)}
                          title="Edit Employee"
                        >
                          ⋮
                        </button>

                        <button
                          className="employee-status-action"
                          onClick={() => handleToggleStatus(employee)}
                        >
                          {employee.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;

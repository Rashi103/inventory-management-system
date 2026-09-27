
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      roles: ["Manager", "Inventory Staff", "Sales Executive", "Accountant"],
    },
    {
      name: "Products",
      path: "/products",
      roles: ["Manager", "Inventory Staff"],
    },
    {
      name: "Inventory",
      path: "/inventory",
      roles: ["Manager", "Inventory Staff"],
    },
    {
      name: "Categories",
      path: "/categories",
      roles: ["Manager", "Inventory Staff"],
    },
    {
      name: "Subcategories",
      path: "/subcategories",
      roles: ["Manager", "Inventory Staff"],
    },
    {
      name: "Brands",
      path: "/brands",
      roles: ["Manager", "Inventory Staff"],
    },
    {
      name: "Suppliers",
      path: "/suppliers",
      roles: ["Manager", "Inventory Staff"],
    },
    {
      name: "Customers",
      path: "/customers",
      roles: ["Manager", "Sales Executive"],
    },
    {
      name: "Purchases",
      path: "/purchases",
      roles: ["Manager", "Inventory Staff"],
    },
    {
      name: "Sales",
      path: "/sales",
      roles: ["Manager", "Sales Executive", "Accountant"],
    },
    {
      name: "Reports",
      path: "/reports",
      roles: ["Manager", "Accountant"],
    },
    {
      name: "Warehouse",
      path: "/warehouse",
      roles: ["Manager", "Inventory Staff"],
    },
    {
      name: "Returns",
      path: "/returns",
      roles: ["Manager", "Sales Executive"],
    },
    {
      name: "Employees",
      path: "/employees",
      roles: ["Manager"],
    },
  ];

  const visibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>Inventory</h2>
        <span>Management System</span>
      </div>

      <nav className="sidebar-menu">
        {visibleMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;


import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Inventory", path: "/inventory" },
    { name: "Categories", path: "/categories" },
    { name: "Subcategories", path: "/subcategories" },
    { name: "Brands", path: "/brands" },
    { name: "Suppliers", path: "/suppliers" },
    { name: "Customers", path: "/customers" },
    { name: "Purchases", path: "/purchases" },
    { name: "Sales", path: "/sales" },
    { name: "Reports", path: "/reports" },
    { name: "Warehouse", path: "/warehouse" },
    { name: "Returns", path: "/returns" },
    { name: "Employees", path: "/employees" },
    
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>Inventory</h2>
        <span>Management System</span>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
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


import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Categories from "./pages/Categories";
import Subcategories from "./pages/Subcategories";
import Brands from "./pages/Brands";
import Suppliers from "./pages/Suppliers";
import Customers from "./pages/Customers";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import Warehouse from "./pages/Warehouse";
import Returns from "./pages/Returns";
import Employees from "./pages/Employees";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const MainLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <main className="page-content">
          <Routes>
            {/* Dashboard - All authenticated users */}
            <Route path="/" element={<Dashboard />} />

            {/* Manager + Inventory Staff */}
            <Route
              element={
                <RoleProtectedRoute
                  allowedRoles={["Manager", "Inventory Staff"]}
                />
              }
            >
              <Route path="/products" element={<Products />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/subcategories" element={<Subcategories />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/purchases" element={<Purchases />} />
              <Route path="/warehouse" element={<Warehouse />} />
            </Route>

            {/* Manager + Sales Executive */}
            <Route
              element={
                <RoleProtectedRoute
                  allowedRoles={["Manager", "Sales Executive"]}
                />
              }
            >
              <Route path="/customers" element={<Customers />} />
              <Route path="/returns" element={<Returns />} />
            </Route>

            {/* Manager + Sales Executive + Accountant */}
            <Route
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    "Manager",
                    "Sales Executive",
                    "Accountant",
                  ]}
                />
              }
            >
              <Route path="/sales" element={<Sales />} />
            </Route>

            {/* Manager + Accountant */}
            <Route
              element={
                <RoleProtectedRoute
                  allowedRoles={["Manager", "Accountant"]}
                />
              }
            >
              <Route path="/reports" element={<Reports />} />
            </Route>

            {/* Manager only */}
            <Route
              element={
                <RoleProtectedRoute allowedRoles={["Manager"]} />
              }
            >
              <Route path="/employees" element={<Employees />} />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="*" element={<MainLayout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import SubCategories from "./pages/SubCategories";
import Brands from "./pages/Brands";
import Suppliers from "./pages/Suppliers";
import Inventory from "./pages/Inventory";
import Warehouse from "./pages/Warehouse";
import Customers from "./pages/Customers";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";
import Returns from "./pages/Returns";
import Employees from "./pages/Employees";


import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />

        <div className="main-section">
          <Navbar />

          <main className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/subcategories" element={<SubCategories />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/warehouse" element={<Warehouse />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/purchases" element={<Purchases />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/employees" element={<Employees />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
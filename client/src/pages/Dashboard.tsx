function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p>Overview of your inventory and business.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <p>Total Products</p>
            <h3>0</h3>
          </div>
          <div className="stat-icon">📦</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <p>Total Sales</p>
            <h3>₹0</h3>
          </div>
          <div className="stat-icon">💰</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <p>Low Stock</p>
            <h3>0</h3>
          </div>
          <div className="stat-icon">⚠️</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <p>Total Customers</p>
            <h3>0</h3>
          </div>
          <div className="stat-icon">👥</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Sales</h3>
            <button>View All</button>
          </div>

          <div className="empty-state">
            <span>🧾</span>
            <p>No sales available yet.</p>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Low Stock Products</h3>
            <button>View All</button>
          </div>

          <div className="empty-state">
            <span>📊</span>
            <p>No low-stock products.</p>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-header">
          <h3>Inventory Overview</h3>
        </div>

        <div className="inventory-overview">
          <div>
            <span className="overview-label">In Stock</span>
            <strong>0</strong>
          </div>

          <div>
            <span className="overview-label">Low Stock</span>
            <strong>0</strong>
          </div>

          <div>
            <span className="overview-label">Out of Stock</span>
            <strong>0</strong>
          </div>

          <div>
            <span className="overview-label">Expired</span>
            <strong>0</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
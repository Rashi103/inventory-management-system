import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (confirmLogout) {
      logout();
    }
  };

  return (
    <header className="navbar">
      <div>
        <h1>Inventory Management System</h1>
      </div>

      <div className="navbar-user">
        <div className="navbar-user-info">
          <div className="navbar-avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="navbar-user-details">
            <strong>{user?.name || "User"}</strong>
            <span>{user?.role || "User"}</span>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
          title="Logout"
        >
          <span className="logout-icon">↪</span>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;

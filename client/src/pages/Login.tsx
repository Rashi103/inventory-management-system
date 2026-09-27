
import { FormEvent, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username,
          password,
        }
      );

      login(response.data.token, response.data.user);

      navigate("/");
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Unable to connect to the server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          Inventory Management System
        </h1>

        <p style={styles.subtitle}>
          Login to your account
        </p>

        <form onSubmit={handleLogin}>
          <div style={styles.field}>
            <label>Username</label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div style={styles.field}>
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <p style={styles.error}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.demo}>
          Demo: rahul / password123
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
  },

  card: {
    width: "400px",
    padding: "35px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },

  title: {
    textAlign: "center" as const,
    fontSize: "24px",
    marginBottom: "8px",
  },

  subtitle: {
    textAlign: "center" as const,
    color: "#666",
    marginBottom: "25px",
  },

  field: {
    display: "flex",
    flexDirection: "column" as const,
    marginBottom: "18px",
    gap: "6px",
  },

  error: {
    color: "#d32f2f",
    fontSize: "14px",
    marginBottom: "15px",
  },

  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#1976d2",
    color: "#ffffff",
    fontSize: "16px",
    cursor: "pointer",
  },

  demo: {
    textAlign: "center" as const,
    marginTop: "20px",
    fontSize: "13px",
    color: "#777",
  },
};

export default Login;


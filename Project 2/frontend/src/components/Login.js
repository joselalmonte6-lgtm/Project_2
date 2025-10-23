import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [userCreds, setUserCreds] = useState({ username: "", password: "" });
  const [adminCreds, setAdminCreds] = useState({ username: "", password: "" });

  // ---- User Login ----
  const handleUserLogin = async () => {
    try {
      const res = await axios.post("/api/login/user", userCreds);
      const { token } = res.data;
      localStorage.setItem(
        "user",
        JSON.stringify({ ...userCreds, role: "user", token })
      );
      window.location.href = "/user-dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "User login failed");
    }
  };

  // ---- Admin Login ----
  const handleAdminLogin = async () => {
    try {
      const res = await axios.post("/api/login/admin", adminCreds);
      const { token } = res.data;
      localStorage.setItem(
        "user",
        JSON.stringify({ ...adminCreds, role: "admin", token })
      );
      window.location.href = "/admin-dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Admin login failed");
    }
  };

  // ---- Styles ----
  const containerStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
    maxWidth: "900px",
    margin: "60px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  };

  const cardStyle = {
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    padding: "30px",
  };

  const titleStyle = {
    textAlign: "center",
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "20px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginBottom: "12px",
    fontSize: "14px",
  };

  const buttonBase = {
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "white",
    fontWeight: "500",
  };

  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  };

  return (
    <div style={containerStyle}>
      {error && (
        <p
          style={{
            gridColumn: "1 / span 2",
            textAlign: "center",
            color: "red",
            fontWeight: "500",
          }}
        >
          {error}
        </p>
      )}

      {/* ---------- User Login ---------- */}
      <div style={cardStyle}>
        <h2 style={titleStyle}>User Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={userCreds.username}
          onChange={(e) =>
            setUserCreds({ ...userCreds, username: e.target.value })
          }
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={userCreds.password}
          onChange={(e) =>
            setUserCreds({ ...userCreds, password: e.target.value })
          }
          style={inputStyle}
        />
        <div style={rowStyle}>
          <button
            type="button"
            onClick={handleUserLogin}
            style={{ ...buttonBase, backgroundColor: "#2563eb" }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate("/register")}
            style={{ ...buttonBase, backgroundColor: "#6b7280" }}
          >
            Register
          </button>
        </div>
      </div>

      {/* ---------- Admin Login ---------- */}
      <div style={cardStyle}>
        <h2 style={titleStyle}>Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={adminCreds.username}
          onChange={(e) =>
            setAdminCreds({ ...adminCreds, username: e.target.value })
          }
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={adminCreds.password}
          onChange={(e) =>
            setAdminCreds({ ...adminCreds, password: e.target.value })
          }
          style={inputStyle}
        />
        <div style={rowStyle}>
          <button
            type="button"
            onClick={handleAdminLogin}
            style={{ ...buttonBase, backgroundColor: "#2563eb" }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate("/register")}
            style={{ ...buttonBase, backgroundColor: "#6b7280" }}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

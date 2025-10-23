import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [userCreds, setUserCreds] = useState({ username: "", password: "" });
  const [adminCreds, setAdminCreds] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ---- User Register ----
  const handleUserRegister = async () => {
    try {
      await axios.post("/api/register/user", userCreds);
      alert("User registered successfully. You can now login.");
      setUserCreds({ username: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "User registration failed");
    }
  };

  // ---- Admin Register ----
  const handleAdminRegister = async () => {
    try {
      await axios.post("/api/register/admin", adminCreds);
      alert("Admin registered successfully. You can now login.");
      setAdminCreds({ username: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Admin registration failed");
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

      {/* ---------- User Register ---------- */}
      <div style={cardStyle}>
        <h2 style={titleStyle}>User Register</h2>
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
            onClick={handleUserRegister}
            style={{ ...buttonBase, backgroundColor: "#2563eb" }}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{ ...buttonBase, backgroundColor: "#6b7280" }}
          >
            Go to Login
          </button>
        </div>
      </div>

      {/* ---------- Admin Register ---------- */}
      <div style={cardStyle}>
        <h2 style={titleStyle}>Admin Register</h2>
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
            onClick={handleAdminRegister}
            style={{ ...buttonBase, backgroundColor: "#2563eb" }}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{ ...buttonBase, backgroundColor: "#6b7280" }}
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;

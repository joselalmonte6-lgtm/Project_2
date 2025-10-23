import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminDashboard() {
  const [games, setGames] = useState([]);
  const [gameForm, setGameForm] = useState({ title: "", genre: "", releaseYear: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await axios.get("/api/games", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGames(res.data);
    } catch (err) {
      setMessage("Error loading games");
    }
  };

  const handleSubmit = async () => {
    if (!gameForm.title || !gameForm.genre || !gameForm.releaseYear) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/api/games/${editingId}`, gameForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Game updated!");
      } else {
        await axios.post("/api/games", gameForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Game added!");
      }

      setGameForm({ title: "", genre: "", releaseYear: "" });
      setEditingId(null);
      fetchGames();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error saving game");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/games/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Game deleted!");
      fetchGames();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error deleting game");
    }
  };

  const handleEdit = (game) => {
    setGameForm({
      title: game.title,
      genre: game.genre,
      releaseYear: game.releaseYear,
    });
    setEditingId(game._id);
    setMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // ----------- Styles -----------
  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    padding: "30px",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
  };

  const cardStyle = {
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  };

  const buttonBase = {
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "white",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginBottom: "10px",
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{ ...buttonBase, backgroundColor: "#dc2626" }}
        >
          Logout
        </button>
      </div>

      {message && (
        <p style={{ marginTop: "10px", color: "red" }}>{message}</p>
      )}

      {/* Game Form */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: "15px" }}>
          {editingId ? "Edit Game" : "Add Game"}
        </h3>

        <input
          type="text"
          placeholder="Title"
          value={gameForm.title}
          onChange={(e) => setGameForm({ ...gameForm, title: e.target.value })}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Genre"
          value={gameForm.genre}
          onChange={(e) => setGameForm({ ...gameForm, genre: e.target.value })}
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Release Year"
          value={gameForm.releaseYear}
          onChange={(e) => setGameForm({ ...gameForm, releaseYear: e.target.value })}
          style={inputStyle}
        />

        <button
          onClick={handleSubmit}
          style={{
            ...buttonBase,
            backgroundColor: "#2563eb",
          }}
        >
          {editingId ? "Update Game" : "Add Game"}
        </button>
      </div>

      {/* Game List */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: "15px" }}>Existing Games</h3>

        {games.length === 0 ? (
          <p>No games added yet.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#e5e7eb" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Title</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Genre</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Release Year</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game._id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{game.title}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{game.genre}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{game.releaseYear}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <button
                      onClick={() => handleEdit(game)}
                      style={{
                        ...buttonBase,
                        backgroundColor: "#f59e0b",
                        marginRight: "6px",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(game._id)}
                      style={{
                        ...buttonBase,
                        backgroundColor: "#dc2626",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

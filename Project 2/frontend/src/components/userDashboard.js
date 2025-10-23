import React, { useState, useEffect } from "react";
import axios from "axios";

function UserDashboard() {
  const [games, setGames] = useState([]);
  const [reviewsByGame, setReviewsByGame] = useState({});
  const [selectedGame, setSelectedGame] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetchGames();
    fetchReviews();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await axios.get("/api/games");
      setGames(res.data);
    } catch (err) {
      console.error("Error fetching games", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get("/api/reviews");
      const allReviews = res.data;

      // Group reviews by game ID
      const grouped = {};
      allReviews.forEach((r) => {
        const gameId = typeof r.game === "string" ? r.game : r.game?._id;
        if (!gameId) return;
        if (!grouped[gameId]) grouped[gameId] = [];
        grouped[gameId].push(r);
      });

      setReviewsByGame(grouped);
    } catch (err) {
      console.error("Error fetching reviews", err);
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedGame || !reviewText) return alert("Select a game and write a review");

    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      await axios.post(
        "/api/reviews",
        { gameId: selectedGame, text: reviewText, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Reset form
      setReviewText("");
      setRating(5);
      setSelectedGame("");

      // Refresh reviews
      fetchReviews();
    } catch (err) {
      console.error("Error submitting review", err);
      alert("Error submitting review");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

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

  const gameTitleStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px",
  };

  const reviewTextStyle = {
    marginLeft: "15px",
    color: "#333",
    lineHeight: "1.4",
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>User Dashboard</h2>
        <button onClick={handleLogout} style={{ padding: "6px 10px", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      {/* Review Form */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "15px", marginBottom: "25px" }}>
        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          style={{ padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
        >
          <option value="">Select a game</option>
          {games.map((game) => (
            <option key={game._id} value={game._id}>
              {game.title}
            </option>
          ))}
        </select>

        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          style={{ padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          style={{ width: "250px", height: "50px", padding: "5px", borderRadius: "6px", border: "1px solid #ccc" }}
        />

        <button
          onClick={handleReviewSubmit}
          style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer" }}
        >
          Submit
        </button>
      </div>

      {/* Game Reviews */}
      <h3 style={{ marginBottom: "10px" }}>Games:</h3>
      {games.map((game) => (
        <div key={game._id} style={cardStyle}>
          <div style={gameTitleStyle}>
            {game.title} / {game.genre} / {game.releaseYear}
          </div>
          <div>
            {reviewsByGame[game._id] && reviewsByGame[game._id].length > 0 ? (
              reviewsByGame[game._id].map((r) => (
                <p key={r._id} style={reviewTextStyle}>
                  <strong>{r.rating}/10:</strong> {r.text}
                </p>
              ))
            ) : (
              <p style={{ marginLeft: "10px", color: "#666" }}>No reviews yet</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserDashboard;

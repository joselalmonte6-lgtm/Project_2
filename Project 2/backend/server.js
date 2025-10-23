require('dotenv').config({ path: __dirname + '/.env' });
const Game = require('./models/Game');
const auth = require('./middleware/auth');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

console.log('MONGO_URI from .env:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

// Register USER
app.post('/api/register/user', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Missing fields' });

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username taken' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed, role: 'user' });
    await user.save();

    res.json({ message: 'User registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register ADMIN
app.post('/api/register/admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Missing fields' });

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username taken' });

    const hashed = await bcrypt.hash(password, 10);
    const admin = new User({ username, password: hashed, role: 'admin' });
    await admin.save();

    res.json({ message: 'Admin registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// USER login
app.post('/api/login/user', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ username, role: 'user' });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token, role: 'user' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN login
app.post('/api/login/admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ username, role: 'admin' });
    if (!user) return res.status(400).json({ message: 'Admin not found' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token, role: 'admin' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get all games (public)
app.get('/api/games', async (req, res) => {
  const games = await Game.find();
  res.json(games);
});

// Add new game (admin only)
app.post('/api/games', auth('admin'), async (req, res) => {
  try {
    const { title, genre, releaseYear } = req.body;

    if (!title || !genre || !releaseYear) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const game = new Game({ title, genre, releaseYear });
    await game.save();

    res.json({ message: 'Game added', game });
  } catch (err) {
    console.error("Error adding game:", err.message);
    res.status(500).json({ message: 'Error adding game' });
  }
});

// Update game (admin only)
app.put('/api/games/:id', auth('admin'), async (req, res) => {
  try {
    const { title, genre, releaseYear } = req.body;

    if (!title || !genre || !releaseYear) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const game = await Game.findByIdAndUpdate(
      req.params.id,
      { title, genre, releaseYear },
      { new: true }
    );

    if (!game) return res.status(404).json({ message: 'Game not found' });

    res.json({ message: 'Game updated', game });
  } catch (err) {
    console.error("Error updating game:", err.message);
    res.status(500).json({ message: 'Error updating game' });
  }
});

// Delete game (admin only)
app.delete('/api/games/:id', auth('admin'), async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);

    if (!game) return res.status(404).json({ message: 'Game not found' });

    res.json({ message: 'Game deleted' });
  } catch (err) {
    console.error("Error deleting game:", err.message);
    res.status(500).json({ message: 'Error deleting game' });
  }
});

const Review = require("./models/Review");

// ---------------- REVIEWS ----------------

// Get all reviews (public)
app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().populate("game", "title genre releaseYear"); 
    res.json(reviews);
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// Add a review (user only)
app.post("/api/reviews", async (req, res) => {
  try {
    const { gameId, text, rating } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1];
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    const username = decoded.username || decoded.id || "Anonymous";

    const review = new Review({
      username,
      game: gameId,
      text,
      rating,
    });

    await review.save();
    res.json({ message: "Review added", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding review" });
  }
});

// Simple protected route
app.get('/api/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.listen(port, () => console.log('Server running on port', port));

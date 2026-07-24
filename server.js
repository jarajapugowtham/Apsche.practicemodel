const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

// IDHI KOTTA GA ADD CHEY
app.get("/", (req, res) => {
  res.json({ success: true, msg: "APSCHE API Running" });
});

// MIGATA ROUTES KADA UNDI GA
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, college } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    // TODO: Add your User model and DB logic here
    // Example (pseudo-code):
    // const existing = await User.findOne({ email });
    // if (existing) return res.status(400).json({ success: false, msg: "User exists" });
    // const hashed = await bcrypt.hash(password, 10);
    // const user = await User.create({ name, email, password: hashed, college });

    res.status(201).json({ success: true, msg: "User registered (placeholder)" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, msg: "Email and password required" });
    }

    // TODO: Add your User model and DB logic here
    // Example (pseudo-code):
    // const user = await User.findOne({ email });
    // if (!user) return res.status(401).json({ success: false, msg: "Invalid credentials" });
    // const match = await bcrypt.compare(password, user.password);
    // if (!match) return res.status(401).json({ success: false, msg: "Invalid credentials" });

    res.json({ success: true, msg: "Login successful (placeholder)" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

app.get("/colleges", (req, res) => {
  // TODO: Replace with real data or DB query
  const colleges = [
    { id: 1, name: "College A" },
    { id: 2, name: "College B" },
  ];

  res.json({ success: true, data: colleges });
});

// Optional: connect to MongoDB if you have a URI in env
// mongoose.connect(process.env.MONGODB_URI);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

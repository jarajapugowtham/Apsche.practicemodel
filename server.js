const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();

// CORS FIX - Allow both Vercel and GitHub Pages
app.use(cors({
  origin: [
    "https://apsche-practicemodel.vercel.app",
    "https://jarajapugowtham.github.io"
  ]
}));

app.use(express.json());

// HEALTH CHECK ROUTE
app.get("/", (req, res) => {
  res.json({ success: true, msg: "APSCHE API Running" });
});

// REGISTER ROUTE
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, college } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    // TODO: Add your User model and DB logic here
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

// LOGIN ROUTE
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, msg: "Email and password required" });
    }

    // TODO: Add your User model and DB logic here

    res.json({ success: true, msg: "Login successful (placeholder)" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// COLLEGES ROUTE
app.get("/colleges", (req, res) => {
  const colleges = [
    { id: 1, name: "College A" },
    { id: 2, name: "College B" },
  ];
  res.json({ success: true, data: colleges });
});

// DB CONNECT - enable this later when you have MongoDB URI
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch(err => console.log("MongoDB Error:", err));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

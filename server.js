const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// 🔗 MongoDB
mongoose.connect("mongodb+srv://360tawhid_db_KING:YOUR_PASSWORD@king360.pi7ezue.mongodb.net/Madrasha")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// 📦 Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String
});

const User = mongoose.model("User", userSchema);

const studentSchema = new mongoose.Schema({
  id: String,
  name: String,
  math: Number,
  eng: Number,
  sci: Number,
  prog: Number,
  total: Number,
  grade: String
});

const Student = mongoose.model("Student", studentSchema);

// 🔐 LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.json({ success: false });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ success: false });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    "secret123"
  );

  res.json({ success: true, token, role: user.role });
});

// 🔐 Middleware
function auth(req, res, next) {
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, "secret123");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}

function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

// ➕ Add Student (admin only)
app.post("/add", auth, isAdmin, async (req, res) => {
  const s = req.body;
  s.total = s.math + s.eng + s.sci + s.prog;
  await Student.create(s);
  res.json({ success: true });
});

// 📥 Get Students
app.get("/students", auth, async (req, res) => {
  const data = await Student.find();
  res.json(data);
});

// 🚀 Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
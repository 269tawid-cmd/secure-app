const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// 🔗 MongoDB (password বসাও)
mongoose.connect("mongodb+srv://360tawhid_db_KING:YOUR_PASSWORD@king360.pi7ezue.mongodb.net/Madrasha")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// 📦 USER
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String
});
const User = mongoose.model("User", userSchema);

// 📦 STUDENT
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
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.json({ success: false });

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.json({ success: false });

  const token = jwt.sign({ id: user._id, role: user.role }, "secret123");

  res.json({ success: true, token, role: user.role });
});

// 🔐 MIDDLEWARE
function auth(req, res, next) {
  const token = req.headers.authorization;
  try {
    req.user = jwt.verify(token, "secret123");
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

// ➕ ADD STUDENT
app.post("/add", auth, isAdmin, async (req, res) => {
  const s = req.body;

  s.total = s.math + s.eng + s.sci + s.prog;

  if (s.total >= 80) s.grade = "A+";
  else if (s.total >= 60) s.grade = "A";
  else if (s.total >= 40) s.grade = "B";
  else s.grade = "F";

  await Student.create(s);

  res.json({ success: true });
});

// 📥 GET STUDENTS
app.get("/students", auth, async (req, res) => {
  res.json(await Student.find());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));

const createAdmin = async () => {
  const existing = await User.findOne({ username: "King-Tawhid" });

  if (!existing) {
    const hashed = await bcrypt.hash("king321", 10);

    await User.create({
      username: "King-Tawhid",
      password: hashed,
      role: "admin"
    });

    console.log("Admin created");
  }
};

createAdmin();

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // basic validation
  if (!username || !password) {
    return res.json({ success: false, message: "Missing fields" });
  }

  // already exists?
  const exists = await User.findOne({ username });
  if (exists) {
    return res.json({ success: false, message: "User already exists" });
  }

  // hash password
  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    username,
    password: hashed,
    role: "user" // default user
  });

  res.json({ success: true });
});
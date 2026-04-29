const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// middleware
app.use(express.json());
app.use(express.static("public"));

// ================== DB CONNECT ==================
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await createAdmin(); // ensure default admin
  })
  .catch(err => console.log(err));

// ================== SCHEMAS ==================
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

// ================== AUTH ROUTES ==================

// REGISTER
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || password.length < 4) {
    return res.json({ success: false, message: "Invalid input" });
  }

  const exists = await User.findOne({ username });
  if (exists) {
    return res.json({ success: false, message: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    username,
    password: hashed,
    role: "user"
  });

  res.json({ success: true });
});

// LOGIN
app.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.json({ success: false });

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.json({ success: false });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ success: true, token, role: user.role });
});

// ================== MIDDLEWARE ==================
function auth(req, res, next) {
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

// ================== STUDENT ROUTES ==================

// ADD STUDENT (admin only)
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

// GET ALL STUDENTS
app.get("/students", auth, async (req, res) => {
  const data = await Student.find();
  res.json(data);
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

// ✏️ UPDATE STUDENT
app.put("/update/:id", auth, isAdmin, async (req, res) => {
  await Student.findOneAndUpdate(
    { id: req.params.id },
    req.body
  );
  res.json({ success: true });
});

// ❌ DELETE STUDENT
app.delete("/delete/:id", auth, isAdmin, async (req, res) => {
  await Student.findOneAndDelete({ id: req.params.id });
  res.json({ success: true });
});
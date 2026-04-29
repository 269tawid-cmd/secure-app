const express = require("express");
const app = express();
const mongoose = require("mongoose"); // ← এটা add করো

app.use(express.json());
app.use(express.static("public"));
// 👇 এখানেই MongoDB connect বসাও
mongoose.connect("mongodb+srv://360tawhid_db_KING:kingkhan77797KING@king360.pi7ezue.mongodb.net/Madrasha")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// login API
app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    username,
    password: hashed,
    role
  });

  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model("User", userSchema);
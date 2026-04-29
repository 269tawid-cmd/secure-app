const express = require("express");
const app = express();
const mongoose = require("mongoose"); // ← এটা add করো

app.use(express.json());
app.use(express.static("public"));
// 👇 এখানেই MongoDB connect বসাও
mongoose.connect("mongodb+srv://360tawhid_db_KING:YOUR_PASSWORD@king360.pi7ezue.mongodb.net/Madrasha")
mongoose.connect("mongodb+srv://360tawhid_db_KING:kingkhan77797KING@king360.pi7ezue.mongodb.net/Madrasha")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
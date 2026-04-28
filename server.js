const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// simple login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
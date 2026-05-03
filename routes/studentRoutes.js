const express = require("express");
const router = express.Router();
const {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
const { auth, isAdmin } = require("../middleware/authMiddleware");

router.get("/students", auth, getStudents);
router.post("/add", auth, isAdmin, addStudent);
router.put("/update/:id", auth, isAdmin, updateStudent);
router.delete("/delete/:id", auth, isAdmin, deleteStudent);

module.exports = router;

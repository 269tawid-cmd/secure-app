const Student = require("../models/Student");

// @desc    Get all students
// @route   GET /students
// @access  Private
const getStudents = async (req, res) => {
  try {
    const data = await Student.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Fetch error" });
  }
};

// @desc    Add new student
// @route   POST /add
// @access  Private/Admin
const addStudent = async (req, res) => {
  try {
    const s = req.body;

    if (!s.id || !s.name) {
      return res.json({ success: false, message: "ID & Name required" });
    }

    const exists = await Student.findOne({ id: s.id });
    if (exists) {
      return res.json({ success: false, message: "ID already exists" });
    }

    // validate marks
    if (s.subjects) {
      for (let key in s.subjects) {
        if (s.subjects[key] > 100) {
          return res.json({ success: false, message: `${key} max 100` });
        }
      }
      
      // calculate total
      s.total = Object.values(s.subjects).reduce((a, b) => a + b, 0);

      // calculate average
      const avg = s.total / Object.keys(s.subjects).length;

      // grade system
      if (avg >= 80) s.grade = "A+";
      else if (avg >= 60) s.grade = "A";
      else if (avg >= 40) s.grade = "B";
      else s.grade = "F";
    }

    await Student.create(s);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Add error" });
  }
};

// @desc    Update student
// @route   PUT /update/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
  try {
    await Student.findOneAndUpdate({ id: req.params.id }, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Update error" });
  }
};

// @desc    Delete student
// @route   DELETE /delete/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
  try {
    await Student.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete error" });
  }
};

module.exports = {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
};

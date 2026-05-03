const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Student ID is required"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Student name is required"],
  },
  class: {
    type: String,
    required: [true, "Class is required"],
    enum: ["Nazera", "Hifz", "Taisir", "Mijan", "Nahbemir", "Kafia", "Sharhe Bekaya", "Mutafarreka"],
  },
  subjects: {
    type: Map,
    of: Number,
  },
  total: {
    type: Number,
  },
  grade: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);

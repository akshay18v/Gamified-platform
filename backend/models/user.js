const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher"], required: true },
  class: String,   // class for both teacher and student
  ecoPoints: { type: Number, default: 0 },
  badges: [String]
});

// Prevent overwrite error
module.exports = mongoose.models.User || mongoose.model("User", UserSchema);

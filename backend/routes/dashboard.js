const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/user");

// GET /api/dashboard
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role === "teacher") {
      // Teacher sees all students in their class
      const students = await User.find({ class: req.user.class, role: "student" }).select("-password");
      return res.json(students);
    } else {
      // Student sees their own info and classmates' ranks
      const classmates = await User.find({ class: req.user.class, role: "student" })
                                   .select("name ecoPoints")
                                   .sort({ ecoPoints: -1 });
      return res.json(classmates);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

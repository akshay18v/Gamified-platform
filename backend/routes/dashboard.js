const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/user");

// GET /api/dashboard
router.get("/", authMiddleware, async (req, res) => {
  try {
    // **MODIFICATION FOR TEACHER ROLE STARTS HERE**
    if (req.user.role === "teacher") {
      // Find all students in the teacher's class and sort them by points
      const students = await User.find({ class: req.user.class, role: "student" })
                                   .sort({ ecoPoints: -1 })
                                   .select("-password");

      // Calculate summary statistics
      const totalStudents = students.length;
      const totalPoints = students.reduce((sum, s) => sum + s.ecoPoints, 0);
      const averagePoints = totalStudents > 0 ? Math.round(totalPoints / totalStudents) : 0;
      const highestScore = totalStudents > 0 ? students[0].ecoPoints : 0; // The top student's score

      // Map students to a new array that includes their rank
      const rankedStudents = students.map((s, idx) => ({
        _id: s._id,
        rank: idx + 1,
        name: s.name,
        email: s.email,
        ecoPoints: s.ecoPoints,
        badges: s.badges,
      }));

      // Return a single, structured object with all the data the frontend needs
      return res.json({
        name: req.user.name,
        class: req.user.class,
        students: rankedStudents,
        summary: {
          totalStudents: totalStudents,
          averagePoints: averagePoints,
          highestScore: highestScore,
        },
      });
    } 
    // **TEACHER ROLE LOGIC ENDS HERE**
    else {
      // Student logic remains the same from our previous update
      const classmates = await User.find({ class: req.user.class, role: "student" })
                                   .select("name ecoPoints _id")
                                   .sort({ ecoPoints: -1 });
      return res.json({
        currentUser: req.user,
        leaderboard: classmates,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

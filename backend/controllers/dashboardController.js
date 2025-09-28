const User = require("../models/user");

// Get dashboard info for the logged-in user
exports.getDashboard = async (req, res) => {
  try {
    const user = req.user; // added by authMiddleware

    if (user.role === "student") {
      // For students, send own ecoPoints and badges
      res.json({
        name: user.name,
        class: user.class,
        ecoPoints: user.ecoPoints,
        badges: user.badges,
      });
    } else if (user.role === "teacher") {
      // For teachers, send all students in their class and rankings
      const students = await User.find({ class: user.class, role: "student" }).sort({ ecoPoints: -1 });
      res.json({
        name: user.name,
        class: user.class,
        students: students.map((s, idx) => ({
          rank: idx + 1,
          name: s.name,
          email: s.email,
          ecoPoints: s.ecoPoints,
          badges: s.badges,
        })),
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid role" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

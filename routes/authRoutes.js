const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔐 Protected route (TEST)
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted to protected route",
    user: req.user
  });
});

module.exports = router;


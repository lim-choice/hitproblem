const express = require("express");
const { loginUser } = require("../controllers/authController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// 로그인 API (JWT 발급)
router.post("/login", loginUser);

module.exports = router;

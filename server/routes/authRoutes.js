const express = require("express");
const { loginUser, checkAuth, signUser } = require("../controllers/authController");

const router = express.Router();

router.post("/login", loginUser);   //로그인 API
router.get("/me", checkAuth);       //로그인 상태 확인 API
router.post("/register", signUser);   //회원가입 API

module.exports = router;

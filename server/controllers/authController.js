const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SECRET_KEY } = require("../config/dotenvConfig");
const db = require("../models/userModel"); // DB 연결

// 로그인 함수 (JWT 발급)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await db.getUserByEmail(email);
  if (!user) return res.status(401).json({ message: "이메일이 존재하지 않습니다." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "비밀번호가 틀렸습니다." });

  // JWT 토큰 생성 (유효기간 1시간)
  const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

  res.json({
    status: "success",
    message: "로그인 성공!",
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      },
    },
  });
};

module.exports = { loginUser };

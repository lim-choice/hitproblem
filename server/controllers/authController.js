
const { generateToken, verifyToken } = require("../config/jwtConfig");
const db = require("../models/userModel"); // DB 연결

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// 로그인 함수 (JWT 발급)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await db.getUserByEmail(email);
  if (!user) return res.status(401).json({ message: "이메일이 존재하지 않습니다." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "비밀번호가 틀렸습니다." });

  const token = generateToken(user);

  // ✅ JWT 토큰을 `httpOnly` 쿠키로 저장
  res.cookie("token", token, {
    httpOnly: true, // ✅ JavaScript에서 접근 불가능 (XSS 방어)
    secure: process.env.NODE_ENV === "production", // 🔥 HTTPS 환경에서만 전송
    sameSite: "Strict", // CSRF 방어
    maxAge: 60 * 60 * 1000, // 1시간
  });

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

//로그인 상태확인 API
const checkAuth = (req, res) => {
  const token = req.cookies.token; // ✅ 쿠키에서 JWT 가져오기

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    const user = verifyToken(token);
    res.json({ user });
  } catch (error) {
    return res.status(403).json({ message: "토큰이 유효하지 않습니다." });
  }
};

//회원가입 API
const signUser = async (req, res) => {
  console.log("signUser");
  console.log(req.body);

  const { user, password } = req.body;
  const { email, nick } = user;

  console.log(email, nick, password)
  //동일한 이메일 있는지 확인
  const checkPreUser = await db.getUserByEmail(email);
  console.log("signUser_checkPreUser : ", checkPreUser);
  if (checkPreUser)
    return res.status(401).json({ message: "이메일이 이미 존재합니다." });

  //패스워드 암호화
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const newPassword = await bcrypt.hash(password, salt);

  const result = await db.setNewUser(email, newPassword, nick);

  //동일한 email 외에 실패할 것이 있는지는 확인 필요!
  if (!result)
    return res.status(401).json({ message: "회원가입에 실패하였습니다." });

  res.json({
    status: "success",
    message: "회원가입 성공!",
  });
};

module.exports = { loginUser, checkAuth, signUser };

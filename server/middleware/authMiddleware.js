const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/dotenvConfig");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(403).json({ message: "토큰이 없습니다." });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "토큰이 유효하지 않습니다." });

    req.user = user; // 요청 객체에 사용자 정보 저장
    next();
  });
};

module.exports = authenticateToken;

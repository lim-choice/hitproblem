const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const { PORT } = require("./config/dotenvConfig");

const app = express();

// ✅ CORS 설정 (올바른 프론트엔드 도메인 적용)
app.use(cors({
  origin: "http://localhost:5173", // 🔥 React 클라이언트 주소 확인 후 수정
  credentials: true, // ✅ 쿠키, 인증 정보 포함 허용
}));

app.use(bodyParser.json());

// API 라우트 등록
app.use("/api", authRoutes);

// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});

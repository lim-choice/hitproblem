const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const executionRoutes = require("./routes/executionRoutes");
const reportRouts = require("./routes/reportRouts");
const testRoutes = require("./routes/testRoutes");

const { PORT } = require("./config/dotenvConfig");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// ✅ CORS 설정 (올바른 프론트엔드 도메인 적용)
app.use(
  cors({
    origin: "http://localhost:5173", // 🔥 React 클라이언트 주소 확인 후 수정
    credentials: true, // ✅ 쿠키, 인증 정보 포함 허용
  })
);

// API 라우트 등록
app.use("/api/auth/", authRoutes);
app.use("/api/problem/", problemRoutes);
app.use("/api/execute/", executionRoutes);
app.use("/api/report/", reportRouts);
app.use("/api/test/", testRoutes);

// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});

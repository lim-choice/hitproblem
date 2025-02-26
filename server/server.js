require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 5000;

// ✅ PostgreSQL 연결 풀
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: false,  // 배포 환경에서는 true로 변경
});

// Middleware 설정
app.use(cors());
app.use(express.json());

// ✅ 샘플 문제 데이터
const problems = [
  { id: 1, difficulty: "쉬움", title: "문제 1", description: "모든 사용자 정보를 가져오세요.", answer: "SELECT * FROM users;" },
  { id: 2, difficulty: "중간", title: "문제 2", description: "고객 수를 조회하세요.", answer: "SELECT COUNT(*) FROM customers;" },
  { id: 3, difficulty: "어려움", title: "문제 3", description: "고객 수를 조회하세요@@.", answer: "SELECT COUNT(*) FROM customers;" },
];

// ✅ 문제 목록 API
app.get("/api/problems", (req, res) => {
  res.json(problems);
});

// ✅ 특정 문제 상세 API
app.get("/api/problem/:id", (req, res) => {
  const problem = problems.find((p) => p.id === parseInt(req.params.id));
  if (!problem) return res.status(404).json({ error: "문제를 찾을 수 없습니다." });
  res.json(problem);
});

// ✅ 사용자의 SQL 실행 API
app.post("/api/submit", async (req, res) => {
  const { problemId, userQuery } = req.body;
  if (!problemId || !userQuery) {
    return res.status(400).json({ error: "문제 ID와 SQL 쿼리가 필요합니다." });
  }

  // 문제 가져오기
  const problem = problems.find((p) => p.id === problemId);
  if (!problem) return res.status(404).json({ error: "문제를 찾을 수 없습니다." });

  // SQL Injection 방지: `SELECT` 문만 허용
  if (!/^SELECT/i.test(userQuery)) {
    return res.status(400).json({ error: "SELECT 문만 허용됩니다." });
  }

  try {
    // ✅ PostgreSQL에서 사용자 SQL 실행
    const userResult = await pool.query(userQuery);
    const answerResult = await pool.query(problem.answer);

    // ✅ 결과 비교 (JSON.stringify 활용)
    const isCorrect = JSON.stringify(userResult.rows) === JSON.stringify(answerResult.rows);

    res.json({
      message: isCorrect ? "정답입니다! 🎉" : "오답입니다. 다시 시도하세요.",
      isCorrect,
      userResult: userResult.rows,
    });

  } catch (error) {
    console.error("쿼리 실행 오류:", error);
    res.status(500).json({ error: "SQL 실행 중 오류가 발생했습니다." });
  }
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중`);
});

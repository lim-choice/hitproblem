const pool = require("../config/db");
const translateSQLError = require("../utils/errorTranslator");
const { getProblemById } = require("../models/problemModel");

// SQL 실행 및 정답 비교
const executeMYSQL = async (req, res) => {
  const { problemId, userQuery } = req.body;

  if (!problemId || !userQuery) {
    return res.status(400).json({ status: "error", message: "문제 ID와 SQL 쿼리가 필요합니다." });
  }

  try {
    const problem = await getProblemById(problemId);
    if (!problem) {
      return res.status(404).json({ status: "error", message: "문제를 찾을 수 없습니다." });
    }

    console.log("userQuery >>> ", userQuery);

    // 정답 SQL 실행
    const [correctResult] = await pool.query(problem.answer);

    // 사용자 SQL 실행
    const [userResult] = await pool.query(userQuery);

    // 결과 비교
    const isCorrect = JSON.stringify(correctResult) === JSON.stringify(userResult);

    res.json({
      status: "success",
      isCorrect,
      userResult,
      correctResult,
      message: isCorrect ? "정답입니다! 🎉" : "오답입니다. 다시 시도하세요.",
    });
  } catch (error) {
    console.log("executeMYSQL error >>> ", error);
    res.status(500).json({ status: "error", message: translateSQLError(error) });
  }
};

module.exports = { executeMYSQL };

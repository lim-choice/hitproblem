const { getAllProblems, getProblemByTopic } = require("../models/problemModel");

// 전체 문제 목록 가져오기
const fetchAllProblems = async (req, res) => {
  try {
    const problems = await getAllProblems();
    res.json({
      status: "success",
      message: "문제 목록 가져오기 성공",
      data: problems,
    });
  } catch (error) {
    console.error("[fetchAllProblems] 오류:", error);
    res.status(500).json({ message: "문제 목록을 가져오는 중 오류 발생" });
  }
};

// 특정 문제 가져오기 (Topic)
const fetchProblemByTopic = async (req, res) => {
  const { topic } = req.params;
  try {
    const problem = await getProblemByTopic(topic);
    if (!problem) {
      return res.status(404).json({ message: "해당 문제를 찾을 수 없습니다." });
    }

    res.json({
      status: "success",
      message: "문제 가져오기 성공",
      data: problem,
    });
  } catch (error) {
    console.error("[fetchProblemByTopic] 오류:", error);
    res.status(500).json({ message: "문제를 가져오는 중 오류 발생" });
  }
};

module.exports = { fetchAllProblems, fetchProblemByTopic };

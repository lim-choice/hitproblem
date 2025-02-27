const express = require("express");
const { fetchAllProblems, fetchProblemByTopic } = require("../controllers/problemController");

const router = express.Router();

router.get("/", fetchAllProblems); // ✅ 문제 목록 가져오기
router.get("/:topic", fetchProblemByTopic); // ✅ 특정 주제 문제 가져오기

module.exports = router;

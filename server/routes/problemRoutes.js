const express = require("express");
const { fetchTestSheetList, fetchProblemListByTestSheet, 
    fetchAllProblems, fetchProblemByTopic } = require("../controllers/problemController");

const router = express.Router();

router.get("/", fetchAllProblems); // ✅ 문제 목록 가져오기
router.get("/getTestSheetList", fetchTestSheetList); // ✅ 문제 목록 가져오기
router.get("/getProblemTestSheet", fetchProblemListByTestSheet); // ✅ 문제 목록 가져오기

module.exports = router;

const express = require("express");
const {
  isDuringTest,
  startTest,
  continueTest,
  getProblemListByUserTest,
} = require("../controllers/testController");

const router = express.Router();

router.get("/isDuringTest", isDuringTest); // ✅ 시험이 진행중인지 확인
router.post("/startTest", startTest); // ✅ 시험 시작
router.get("/ContinueTest", continueTest); // ✅ 시험 이어서 진행
router.get("/problemListByTest", getProblemListByUserTest); // ✅ 시험 이어서 진행

module.exports = router;

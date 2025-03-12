const express = require("express");
const {
  isDuringTest,
  startTest,
  continueTest,
} = require("../controllers/testController");

const router = express.Router();

router.get("/isDuringTest", isDuringTest); // ✅ 시험이 진행중인지 확인
router.get("/startTest", startTest); // ✅ 시험 시작
router.get("/startContinue", continueTest); // ✅ 시험 이어서 진행

module.exports = router;

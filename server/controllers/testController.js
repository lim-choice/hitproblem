const db = require("../models/userModel"); // DB 연결
const { verifyToken } = require("../config/jwtConfig");
const {
  getDuringTest,
  destroyTest,
  makeNewTest,
  completeTest,
  saveExamResultsBatch,
  getSavedAnswers,
} = require("../models/testModel");
const { getTestSheetTime } = require("../models/problemModel");
const { fetchProblemList } = require("./problemController");

const isDuringTest = async (req, res) => {
  let token = req.cookies.token; // ✅ 쿠키에서 JWT 가져오기
  const { testSheetId } = req.body;

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    const decoded = verifyToken(token); // ✅ 토큰 해독 (유저 정보 포함)

    // ✅ DB에서 유저 정보 조회
    const user = await db.getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "유저 정보를 찾을 수 없습니다." });
    }
    const userId = user.id;

    const testList = await getDuringTest(userId, testSheetId);

    res.json({
      status: "success",
      message: "전송 성공!",
      testCount: testList?.length ?? 0,
      testList: testList,
    });
  } catch (error) {
    console.error("checkAuth error:", error);
    return res.status(403).json({ message: "토큰이 유효하지 않습니다." });
  }
};

//시험 시작
const startTest = async (req, res) => {
  const token = req.cookies.token; // ✅ 쿠키에서 JWT 가져오기
  const { testSheetId } = req.body;

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    const decoded = verifyToken(token); // ✅ 토큰 해독 (유저 정보 포함)

    // ✅ DB에서 유저 정보 조회
    const user = await db.getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "유저 정보를 찾을 수 없습니다." });
    }

    const userId = user.id;

    //시험이 진행중인지 체크하여 진행중이면 취소 처리
    const testList = await getDuringTest(userId, testSheetId);
    if (testList.length > 0) {
      const existingTestId = testList[0].id;
      destroyTest(existingTestId, "새로운 시험 시작");
    }

    //해당되는 시험이 존재하는지 확인
    const timeLimit = await getTestSheetTime(testSheetId);

    //신규 시험 세션 생성
    const newTestId = await makeNewTest(userId, testSheetId, timeLimit);
    if (!newTestId) {
      throw new Error("시험 세션 생성 실패");
    }

    //시험 시작
    res.json({
      success: true,
      message: "시험이 시작되었습니다.",
      session_id: newTestId,
      test_sheet_id: testSheetId,
      remaining_time: timeLimit,
    });
  } catch (error) {
    console.error("checkAuth error:", error);
    return res.status(403).json({ message: "토큰이 유효하지 않습니다." });
  }
};

//시험 이어서 진행
const continueTest = async (req, res) => {
  const token = req.cookies.token; // ✅ 쿠키에서 JWT 가져오기

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    const decoded = verifyToken(token); // ✅ 토큰 해독 (유저 정보 포함)

    // ✅ DB에서 유저 정보 조회
    const user = await db.getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "유저 정보를 찾을 수 없습니다." });
    }

    const userId = user.id;

    // 진행 중인 시험이 있는지 확인
    const testList = await getDuringTest(userId, null); // ✅ testSheetId 없이 진행 중인 시험 조회
    if (testList.length === 0) {
      return res.status(404).json({ message: "진행 중인 시험이 없습니다." });
    }

    const ongoingTest = testList[0];

    // 남은 시간 계산 (time_limit과 started_at 기반)
    const startTime = new Date(ongoingTest.started_at).getTime();
    const nowTime = Date.now();
    const timeElapsed = (nowTime - startTime) / 1000 / 60; // 분 단위
    const remainingTime = Math.max(0, ongoingTest.time_limit - timeElapsed);

    // 제한시간이 0인 경우에는 취소 로직을 처리하지 않음
    if (ongoingTest.time_limit !== 0) {
      await destroyTest(ongoingTest.id, "시험 시간이 초과되어 자동 취소됨.");

      return res.json({
        success: false,
        message: "시험 시간이 만료되었습니다.",
        session_id: ongoingTest.id,
        status: "cancelled",
      });
    } else {
      ongoingTest.time_limit = 0;
    }

    res.json({
      success: true,
      message: "시험을 이어서 진행합니다.",
      session_id: ongoingTest.id,
      test_sheet_id: ongoingTest.test_sheet_id,
      remaining_time: remainingTime.toFixed(2),
    });
  } catch (error) {
    console.error("[continueTest] 오류 발생:", error);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};

//시험 취소
const cancelTest = async (req, res) => {
  const token = req.cookies.token; // ✅ 쿠키에서 JWT 가져오기

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    const decoded = verifyToken(token); // ✅ 토큰 해독 (유저 정보 포함)

    // DB에서 유저 정보 조회
    const user = await db.getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "유저 정보를 찾을 수 없습니다." });
    }

    const userId = user.id;

    // 진행중인 시험이 있는지 확인
    const testList = await getDuringTest(userId, null);
    const ongoingTest = testList[0];
    if (!ongoingTest) {
      return res.status(404).json({ message: "진행 중인 시험이 없습니다." });
    }

    const testSheetId = ongoingTest.id;
    const result = await destroyTest(testSheetId, "의도적으로 시험 취소");

    if (result == true) {
      res.json({
        status: "success",
        message: "시험 취소 성공",
      });
    } else {
      return res.status(500).json({ message: "진행중인 시험이 없습니다." });
    }
  } catch (error) {
    console.error("[continueTest] 오류 발생:", error);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};

// 유저가 보는 시험 문제 가져오기
const getProblemListByUserTest = async (req, res) => {
  const token = req.cookies.token; // ✅ 쿠키에서 JWT 가져오기

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    const decoded = verifyToken(token); // ✅ 토큰 해독 (유저 정보 포함)

    // DB에서 유저 정보 조회
    const user = await db.getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "유저 정보를 찾을 수 없습니다." });
    }

    const userId = user.id;

    // 진행중인 시험이 있는지 확인
    const testList = await getDuringTest(userId, null);
    const ongoingTest = testList[0];
    if (!ongoingTest) {
      return res.status(404).json({ message: "진행 중인 시험이 없습니다." });
    }

    const testSheetId = ongoingTest.test_sheet_id;
    const formattedProblemList = await fetchProblemList(testSheetId);
    res.json({
      status: "success",
      message: "시험지의 문제 목록 가져오기 성공",
      data: formattedProblemList,
    });
  } catch (error) {
    console.error("[continueTest] 오류 발생:", error);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};

// 문제 제출
const postTestAnswer = async (req, res) => {
  const token = req.cookies.token; // ✅ 쿠키에서 JWT 가져오기
  const { testSession, problem } = req.body;

  console.log("postTestAnswer");
  console.log(req.body);

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    const decoded = verifyToken(token); // ✅ 토큰 해독 (유저 정보 포함)

    // DB에서 유저 정보 조회
    const user = await db.getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "유저 정보를 찾을 수 없습니다." });
    }

    const userId = user.id;
    const session_id = testSession?.id ?? -1;

    console.log("userId: ", userId, ", session_id: ", session_id);

    // 진행중인 시험이 있는지 확인 ==> testList가 98이 나옴
    const testList = await getDuringTest(userId, null);
    console.log("testList: ", testList);
    const ongoingTest = testList[0];
    if (!ongoingTest) {
      return res.status(404).json({ message: "진행 중인 시험이 없습니다." });
    }

    const testSheetId = ongoingTest.id;
    if (session_id !== testSheetId) {
      return res
        .status(404)
        .json({ message: "진행중인 시험과 제출 시험이 다릅니다." });
    }

    //문제 쿼리 적용
    saveExamResultsBatch(testSession, problem);

    res.json({
      status: "success",
      message: "시험 제출 완료",
    });
  } catch (error) {
    console.error("[continueTest] 오류 발생:", error);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};

//시험 완료
const finishTest = async (req, res) => {
  const token = req.cookies.token; // ✅ 쿠키에서 JWT 가져오기
  const { testSession } = req.body;

  console.log("finishTest");
  console.log(req.body);

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    const decoded = verifyToken(token); // ✅ 토큰 해독 (유저 정보 포함)

    // DB에서 유저 정보 조회
    const user = await db.getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "유저 정보를 찾을 수 없습니다." });
    }

    const userId = user.id;
    const session_id = testSession?.id ?? -1;

    console.log("userId: ", userId, ", session_id: ", session_id);

    // 진행중인 시험이 있는지 확인 ==> testList가 98이 나옴
    const testList = await getDuringTest(userId, null);
    console.log("testList: ", testList);
    const ongoingTest = testList[0];
    if (!ongoingTest) {
      return res.status(404).json({ message: "진행 중인 시험이 없습니다." });
    }

    const testSheetId = ongoingTest.id;
    if (session_id !== testSheetId) {
      return res
        .status(404)
        .json({ message: "진행중인 시험과 제출 시험이 다릅니다." });
    }

    const result = await completeTest(testSheetId, "시험 완료");
    if (result == true) {
      res.json({
        status: "success",
        message: "시험 제출 완료",
      });
    } else {
      return res.status(500).json({ message: "진행중인 시험이 없습니다." });
    }
  } catch (error) {
    console.error("[continueTest] 오류 발생:", error);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};

//저장된 시험 답안 불러오기
const fetchSavedAnswers = async (req, res) => {
  const token = req.cookies.token; // ✅ 쿠키에서 JWT 가져오기
  const { testSession } = req.body;

  console.log("finishTest");
  console.log(req.body);

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    const decoded = verifyToken(token); // ✅ 토큰 해독 (유저 정보 포함)

    // DB에서 유저 정보 조회
    const user = await db.getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "유저 정보를 찾을 수 없습니다." });
    }

    const userId = user.id;
    const session_id = testSession?.id ?? -1;

    console.log("userId: ", userId, ", session_id: ", session_id);

    // 진행중인 시험이 있는지 확인 ==> testList가 98이 나옴
    const testList = await getDuringTest(userId, null);
    console.log("testList: ", testList);
    const ongoingTest = testList[0];
    if (!ongoingTest) {
      return res.status(404).json({ message: "진행 중인 시험이 없습니다." });
    }

    const testSheetId = ongoingTest.id;
    if (session_id !== testSheetId) {
      return res
        .status(404)
        .json({ message: "진행중인 시험과 제출 시험이 다릅니다." });
    }

    const savedAnswers = await getSavedAnswers(session_id);
    return res.json({ status: "success", savedAnswers });
  } catch (error) {
    console.error("[fetchSavedAnswers] 오류 발생:", error);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
};

module.exports = {
  isDuringTest,
  startTest,
  continueTest,
  cancelTest,
  getProblemListByUserTest,
  postTestAnswer,
  finishTest,
  fetchSavedAnswers,
};

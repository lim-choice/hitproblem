const db = require("../models/userModel"); // DB 연결
const {
  getDuringTest,
  cancelTest,
  makeNewTest,
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
      cancelTest(existingTestId, "새로운 시험 시작");
    }

    //해당되는 시험이 존재하는지 확인
    const timeLimit = getTestSheetTime(testSheetId);

    //신규 시험 세션 생성
    makeNewTest(userId, testSheetId, timeLimit);

    //트랜잭션 커밋
    await connection.commit();

    //시험 시작
    res.json({
      success: true,
      message: "시험이 시작되었습니다.",
      session_id: result.insertId,
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
      await cancelTest(ongoingTest.id, "시험 시간이 초과되어 자동 취소됨.");

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

module.exports = {
  isDuringTest,
  startTest,
  continueTest,
  getProblemListByUserTest,
};

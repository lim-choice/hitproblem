const {
  getTestSheetList,
  getProblemListByTestSheet,
} = require("../models/problemModel");

//테스트 시트 목록 가져오기
const fetchTestSheetList = async (req, res) => {
  const { type, subType } = req.query;
  try {
    const testSheetList = await getTestSheetList(type, subType);
    if (!testSheetList) {
      return res
        .status(404)
        .json({ message: "테스트 시험지를 찾을 수 없습니다." });
    }

    res.json({
      status: "success",
      message: "시험지 가져오기 성공",
      data: testSheetList,
    });
  } catch (error) {
    console.error("[fetchTestSheetList] 오류:", error);
    res.status(500).json({ message: "시험지를 가져오는 중 오류 발생" });
  }
};

//공통 함수
const fetchProblemList = async (testSheetId) => {
  try {
    const problemList = await getProblemListByTestSheet(testSheetId);
    if (!problemList) {
      return null;
    }

    let index = 0;
    return problemList.map((problem) => ({
      ...problem,
      index: ++index,
      choices: problem.choices
        ? problem.choices.split("§").map((choice) => choice.trim())
        : [],
    }));
  } catch (error) {
    console.error("[fetchProblemList] 오류:", error);
    throw error;
  }
};

//테스트 시트 목록 가져오기
const fetchProblemListByTestSheet = async (req, res) => {
  const { id } = req.query;

  try {
    const formattedProblemList = await fetchProblemList(id);
    if (!formattedProblemList) {
      return res
        .status(404)
        .json({ message: "테스트 시험지를 찾을 수 없습니다." });
    }

    res.json({
      status: "success",
      message: "시험지의 문제 목록 가져오기 성공",
      data: formattedProblemList,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "시험지의 문제 목록을 가져오는 중 오류 발생" });
  }
};

module.exports = {
  fetchTestSheetList,
  fetchProblemList,
  fetchProblemListByTestSheet,
};

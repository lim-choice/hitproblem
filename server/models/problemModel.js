const pool = require("../config/db");

// 전체 문제 목록 가져오기 (최적화된 조회)
const getAllProblems = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT 
        id, 
        title, 
        major_topic, 
        mid_topic, 
        sub_topic, 
        difficulty, 
        content
      FROM problems 
      LIMIT 1000
    `);
    return rows;
  } catch (error) {
    console.error("[getAllProblems] 오류 발생:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

// 특정 문제 가져오기 (Topic)
const getProblemByTopic = async (topic) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      `
        SELECT 
          id, 
          title, 
          major_topic, 
          mid_topic, 
          sub_topic, 
          difficulty, 
          content
        FROM problems
        WHERE major_topic = ?`,
      [topic]
    );
    return rows[0];
  } catch (error) {
    console.error("[getProblemByTopic] 오류 발생:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

// 특정 문제 가져오기 (id)
const getProblemById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM subjective_problems WHERE id = ?",
    [id]
  );
  return rows[0];
};

// 시험지 목록 가져오기 (type, subType이 없는 경우 전체 다 가져오기)
const getTestSheetList = async (type, subType) => {
  let connection;
  try {
    connection = await pool.getConnection();

    let query = `
      SELECT
        ts.id,
        ts.type,
        ts.sub_type,
        ts.title,
        ts.description,
        ts.time,
        COUNT(tq.id) AS question_count  -- ✅ 문제 개수 추가
      FROM test_sheets ts
      LEFT JOIN test_sheet_questions tq ON ts.id = tq.test_sheet_id  -- ✅ 문제 개수 카운트
    `;

    const conditions = [];
    const params = [];

    if (type) {
      conditions.push("ts.type = ?");
      params.push(type);
    }
    if (subType) {
      conditions.push("ts.sub_type = ?");
      params.push(subType);
    }
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " GROUP BY ts.id"; // ✅ 시험지별 문제 개수 계산을 위해 GROUP BY 추가
    query += " LIMIT 1000"; // ✅ 최대 1000개 제한

    const [rows] = await connection.query(query, params);
    return rows;
  } catch (error) {
    console.error("[getTestSheetList] 오류 발생:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

const getProblemListByTestSheet = async (id) => {
  let connection;
  try {
    connection = await pool.getConnection();

    const query = `
      SELECT 
          tq.test_sheet_id,
          tq.problem_type,
          -- 문제 유형에 따라 올바른 problem_id 사용
          CASE 
              WHEN tq.problem_type = 'subjective' THEN sp.id
              WHEN tq.problem_type = 'coding' THEN cp.id
              ELSE mcp.id
          END AS problem_id,

          -- 문제 유형에 따라 제목(title) 가져오기
          CASE 
              WHEN tq.problem_type = 'subjective' THEN sp.title
              WHEN tq.problem_type = 'coding' THEN cp.title
              ELSE mcp.title
          END AS title,

          -- 문제 유형에 따라 난이도(difficulty) 가져오기
          CASE 
              WHEN tq.problem_type = 'subjective' THEN sp.difficulty
              WHEN tq.problem_type = 'coding' THEN cp.difficulty
              ELSE mcp.difficulty
          END AS difficulty,

          -- 문제 유형에 따라 엔진 타입(engine_type) 가져오기
          CASE 
              WHEN tq.problem_type = 'subjective' THEN sp.engine_type
              WHEN tq.problem_type = 'coding' THEN cp.engine_type
              ELSE mcp.engine_type
          END AS engine_type,

          -- 문제 유형에 따라 내용(content) 가져오기
          CASE 
              WHEN tq.problem_type = 'subjective' THEN sp.content
              WHEN tq.problem_type = 'coding' THEN cp.content
              ELSE mcp.content
          END AS content,

          -- 객관식(multiple-choice) 문제의 선택지 가져오기
          CASE 
              WHEN tq.problem_type = 'multiple-choice' 
              THEN GROUP_CONCAT(mco.choice_text ORDER BY mco.choice_index ASC SEPARATOR ', ')
              ELSE NULL
          END AS choices

      FROM test_sheet_questions tq
      LEFT JOIN subjective_problems sp 
          ON tq.problem_type = 'subjective' AND tq.problem_id = sp.id
      LEFT JOIN coding_problems cp
          ON tq.problem_type = 'coding' AND tq.problem_id = cp.id
      LEFT JOIN multiple_choice_problems mcp 
          ON tq.problem_type = 'multiple-choice' AND tq.problem_id = mcp.id
      LEFT JOIN multiple_choice_options mco 
          ON mcp.id = mco.problem_id
      WHERE tq.test_sheet_id = ?
      GROUP BY tq.id;
    `;

    const [rows] = await connection.query(query, [id]);
    return rows;
  } catch (error) {
    console.error("[getProblemListByTestSheet] 오류 발생:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  getAllProblems,
  getProblemByTopic,
  getProblemById,
  getTestSheetList,
  getProblemListByTestSheet,
};

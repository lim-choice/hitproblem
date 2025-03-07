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
        WHERE major_topic = ?`, [topic]);
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
  const [rows] = await pool.query("SELECT * FROM problems WHERE id = ?", [id]);
  return rows[0];
};

// 시험지 목록 가져오기 (type, subType이 없는 경우 전체 다 가져오기)
const getTestSheetList = async(type, subType) => {
  let connection;
  try {
    connection = await pool.getConnection();

    let query = `
      SELECT
        id,
        type,
        sub_type,
        title,
        description
      FROM test_sheets
    `;
    const conditions = [];
    const params = [];

    if (type) {
      conditions.push("type = ?");
      params.push(type);
    }
    if (subType) {
      conditions.push("sub_type = ?");
      params.push(subType);
    }
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    query += " LIMIT 1000";

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
          CASE 
              WHEN tq.problem_type = 'subjective' THEN sp.id
              ELSE mcp.id
          END AS problem_id,
          CASE 
              WHEN tq.problem_type = 'subjective' THEN sp.title
              ELSE mcp.title
          END AS title,
          CASE 
              WHEN tq.problem_type = 'subjective' THEN sp.difficulty
              ELSE mcp.difficulty
          END AS difficulty,
          CASE 
              WHEN tq.problem_type = 'subjective' THEN sp.engine_type
              ELSE mcp.engine_type
          END AS engine_type,
          CASE 
              WHEN tq.problem_type = 'subjective' THEN sp.content
              ELSE mcp.content
          END AS content,
          CASE 
              WHEN tq.problem_type = 'multiple-choice' 
              THEN GROUP_CONCAT(mco.choice_text ORDER BY mco.choice_index ASC)
              ELSE NULL
          END AS choices
      FROM test_sheet_questions tq
      LEFT JOIN subjective_problems sp ON tq.problem_type = 'subjective' AND tq.problem_id = sp.id
      LEFT JOIN multiple_choice_problems mcp ON tq.problem_type = 'multiple-choice' AND tq.problem_id = mcp.id
      LEFT JOIN multiple_choice_options mco ON mcp.id = mco.problem_id
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


module.exports = { getAllProblems, getProblemByTopic, getProblemById, getTestSheetList, getProblemListByTestSheet };

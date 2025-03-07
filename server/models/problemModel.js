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
    console.error("[getProblemByTopic] 오류 발생:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { getAllProblems, getProblemByTopic, getProblemById, getTestSheetList };

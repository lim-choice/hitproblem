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

module.exports = { getAllProblems, getProblemByTopic };

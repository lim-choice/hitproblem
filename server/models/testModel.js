const pool = require("../config/db");

// 진행중인 시험이 있는지 확인
const getDuringTest = async (user_id, test_sheet_id) => {
  let connection;
  try {
    connection = await pool.getConnection();

    let query =
      "SELECT id FROM exam_sessions WHERE user_id = ? AND status = 'in_progress'";
    const params = [user_id];

    if (test_sheet_id) {
      query += " AND test_sheet_id = ?";
      params.push(test_sheet_id);
    }

    const [examSession] = await connection.query(query, params);

    return examSession;
  } catch (error) {
    console.error("[getDuringTest] 오류 발생:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

// 진행중인 시험 삭제
const destroyTest = async (existingTestId, reason) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query(
      `UPDATE exam_sessions 
       SET status = 'cancelled', ended_at = NOW(), cancel_reason = '${reason}' 
       WHERE id = ?`,
      [existingTestId]
    );
    return true;
  } catch (error) {
    console.error("[cancelTest] 오류 발생:", error);
    return false;
  } finally {
    if (connection) connection.release();
  }
};

//신규 시험 시작
const makeNewTest = async (user_id, test_sheet_id, time_limit) => {
  let connection;
  try {
    connection = await pool.getConnection();

    const [result] = await connection.query(
      `INSERT INTO exam_sessions (user_id, test_sheet_id, time_limit, status, started_at) 
       VALUES (?, ?, ?, 'in_progress', NOW())`,
      [user_id, test_sheet_id, time_limit]
    );

    return result.insertId; // ✅ `insertId` 반환하여 `startTest`에서 사용 가능하게 함.
  } catch (error) {
    console.error("[makeNewTest] 오류 발생:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { getDuringTest, destroyTest, makeNewTest };

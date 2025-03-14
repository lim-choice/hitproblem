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

    return result.insertId; // `insertId` 반환하여 `startTest`에서 사용 가능하게 함.
  } catch (error) {
    console.error("[makeNewTest] 오류 발생:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

// 시험 완료
const completeTest = async (existingTestId, reason = null) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query(
      `UPDATE exam_sessions 
       SET status = 'completed', 
           ended_at = NOW(), 
           cancel_reason = ? 
       WHERE id = ?`,
      [reason, existingTestId] // Prepared Statement
    );
    return true;
  } catch (error) {
    console.error("[completeTest] 오류 발생:", error);
    return false;
  } finally {
    if (connection) connection.release();
  }
};

// 시험 문제 제출 (배치)
const saveExamResultsBatch = async (testSession, problems) => {
  if (problems.length === 0) return;

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction(); // 트랜잭션 시작

    const values = problems.map((p) => [
      testSession.id,
      p.problem_type,
      p.problem_id,
      p.answer ?? "", // NULL 방지 (빈 문자열)
      p.correct_answer ?? "", // NULL 방지
      0, // 기본적으로 오답 처리
    ]);

    const placeholders = problems.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");

    const query = `
      INSERT INTO exam_results (exam_session_id, problem_type, problem_id, user_answer, correct_answer, is_correct)
      VALUES ${placeholders}
      ON DUPLICATE KEY UPDATE
      user_answer = VALUES(user_answer),
      correct_answer = VALUES(correct_answer),
      is_correct = VALUES(is_correct);
    `;

    await connection.query(query, values.flat()); // 한 번에 배치 INSERT 실행
    await connection.commit(); // 트랜잭션 커밋
    console.log(`${problems.length}개의 문제 저장 완료`);
  } catch (error) {
    if (connection) await connection.rollback(); // 오류 발생 시 롤백
    console.error(`시험 결과 저장 중 오류 발생:`, error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  getDuringTest,
  destroyTest,
  makeNewTest,
  completeTest,
  saveExamResultsBatch,
};

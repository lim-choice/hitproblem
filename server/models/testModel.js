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

const getLoadSavedTestData = async (examSessionId) => {
  try {
    const query = `
      SELECT 
          tq.test_sheet_id,
          tq.problem_type,
          CASE 
              WHEN tq.problem_type = 'subjective' THEN sp.id
              WHEN tq.problem_type = 'coding' THEN cp.id
              ELSE mcp.id
          END AS problem_id,
          CASE 
              WHEN tq.problem_type = 'subjective' THEN sp.title
              WHEN tq.problem_type = 'coding' THEN cp.title
              ELSE mcp.title
          END AS title,
          CASE 
              WHEN tq.problem_type = 'subjective' THEN sp.difficulty
              WHEN tq.problem_type = 'coding' THEN cp.difficulty
              ELSE mcp.difficulty
          END AS difficulty,
          CASE 
              WHEN tq.problem_type = 'subjective' THEN sp.engine_type
              WHEN tq.problem_type = 'coding' THEN cp.engine_type
              ELSE mcp.engine_type
          END AS engine_type,
          CASE 
              WHEN tq.problem_type = 'subjective' THEN sp.content
              WHEN tq.problem_type = 'coding' THEN cp.content
              ELSE mcp.content
          END AS content,
          CASE 
              WHEN tq.problem_type = 'multiple-choice' 
              THEN GROUP_CONCAT(mco.choice_text ORDER BY mco.choice_index ASC SEPARATOR '§ ')
              ELSE NULL
          END AS choices,
          er.user_answer

      FROM exam_sessions es
      JOIN test_sheets ts ON es.test_sheet_id = ts.id
      JOIN test_sheet_questions tq ON ts.id = tq.test_sheet_id
      LEFT JOIN subjective_problems sp ON tq.problem_type = 'subjective' AND tq.problem_id = sp.id
      LEFT JOIN coding_problems cp ON tq.problem_type = 'coding' AND tq.problem_id = cp.id
      LEFT JOIN multiple_choice_problems mcp ON tq.problem_type = 'multiple-choice' AND tq.problem_id = mcp.id
      LEFT JOIN multiple_choice_options mco ON mcp.id = mco.problem_id
      LEFT JOIN exam_results er 
          ON es.id = er.exam_session_id 
          AND tq.problem_id = er.problem_id 
          AND tq.problem_type = er.problem_type 

      WHERE es.id = ? 
      GROUP BY tq.id, er.user_answer;
    `;

    const [results] = await pool.query(query, [examSessionId]);
    return results;
  } catch (error) {
    console.error("getExamSessionDetails 오류:", error);
    throw error;
  }
};

// 😊 hi
const setAnswerDataResult = async (examSessionId) => {
  try {
    const separator = "|";
    //COMMENT : 바꾸셈
    // const separator = "§";

    const query = `
      SELECT 
        problem_type,
        problem_id,
        user_answer
      FROM exam_results
      WHERE exam_session_id = ${examSessionId}
      `;

    console.log("query ", query);

    const [results] = await pool.query(query);

    console.log(results);
    //배열은 Promise.all 로 리턴 해줘야 pending 으로 안뜸 (COMMENT : 필요한가??)
    return await Promise.all(
      results.map(async (item) => {
        let result, serverAnswer, subQuery, isCorrect;
        const userAnswer = item["user_answer"];
        const problemId = item["problem_id"];
        const problemType = item["problem_type"];

        switch (problemType) {
          case "multiple-choice":
            subQuery = `
            SELECT
              answer_index
            FROM
              multiple_choice_problems
              WHERE id = ${problemId}
          `;

            [result] = await pool.query(subQuery);
            serverAnswer = result[0]["answer_index"];
            isCorrect = serverAnswer == userAnswer ? 1 : 0;
            console.log(
              "multiple-choice serverAnswer : ",
              serverAnswer,
              " userAnswer : ",
              userAnswer,
              " isCorrect : ",
              isCorrect
            );
            break;
          case "coding":
            subQuery = `
            SELECT
              answer
            FROM
              coding_problems
              WHERE id = ${problemId}
          `;

            [result] = await pool.query(subQuery);
            serverAnswer = result[0]["answer"];
            isCorrect = serverAnswer == userAnswer ? 1 : 0;
            console.log(
              "coding serverAnswer : ",
              serverAnswer,
              " userAnswer : ",
              userAnswer,
              " isCorrect : ",
              isCorrect
            );
            break;
          case "subjective":
            subQuery = `
            SELECT
              answer
            FROM
              subjective_problems
              WHERE id = ${problemId}
          `;

            [result] = await pool.query(subQuery);
            serverAnswer = result[0]["answer"];
            console.log("subjective serverAnswer : ", serverAnswer);

            //구분자를 통해 정답을 찾습니다.
            const splitAnswer = serverAnswer.split(separator);
            isCorrect = splitAnswer.includes(userAnswer) ? 1 : 0;
            console.log(
              "subjective splitAnswer : ",
              splitAnswer,
              " userAnswer : ",
              userAnswer,
              " isCorrect : ",
              isCorrect
            );
            break;
          default:
            console.log("정의 되지 않은 코드 발견");
            isCorrect = false;
            break;
        }

        //정답 업데이트
        subQuery = `UPDATE exam_results 
                          SET 
                            is_correct = ${isCorrect} 
                          WHERE 
                            exam_session_id=${examSessionId} AND
                            problem_type="${problemType}" AND
                            problem_id=${problemId}`;

        await pool.query(subQuery);
        return isCorrect;
      })
    );
  } catch (error) {
    console.error("getExamSessionDetails 오류:", error);
    throw error;
  }
};

module.exports = {
  getDuringTest,
  destroyTest,
  makeNewTest,
  completeTest,
  saveExamResultsBatch,
  getLoadSavedTestData,
  setAnswerDataResult,
};

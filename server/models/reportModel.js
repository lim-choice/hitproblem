const pool = require("../config/db");

// 버그 신고 -> db에 저장 
const sendBug = async (user_id ,content) => {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.query(
        "INSERT INTO bug (user_id, content) VALUES (?, ?)",
        [user_id, content]
      );
      return true;
    } catch (error) {
      console.error("[sendBug] 오류 발생:", error);
      return false;
    } finally {
      if (connection) connection.release();
    }
  };
  
  module.exports = { sendBug };
const mysql = require("mysql2/promise");
const {
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_PORT,
} = require("../config/dotenvConfig");

const tableName = "users";

// ✅ 커넥션 풀 설정
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port: DB_PORT, // MySQL 포트 설정
  waitForConnections: true,
  connectionLimit: 10, // ✅ 최대 10개 연결 유지
  queueLimit: 0,
});

// 이메일로 유저 조회
const getUserByEmail = async (email) => {
  console.log(`[getUserByEmail] email: ${email}`);
  let connection;
  try {
    connection = await pool.getConnection(); // 커넥션 가져오기
    const [rows] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0]; // 첫 번째 유저 정보 반환
  } catch (error) {
    console.error("[getUserByEmail] 오류 발생:", error);
    throw error;
  } finally {
    if (connection) connection.release(); // 커넥션 반환 (필수)
  }

  //이전 코드는 pool.execute()로 호출됐으나, 커넥션을 반환하지 않아 시간이 지나면 자동으로 끊기는 문제가 있음
  //read ECONNRESET
};

// ID로 유저 조회
const getUserById = async (id) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  } catch (error) {
    console.error("[getUserById] 오류 발생:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

// 회원가입
const setNewUser = async (email, password, nick) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO users (email, password, nick) VALUES (?, ?, ?)",
      [email, password, nick]
    );
    return true;
  } catch (error) {
    console.error("[setNewUser] 오류 발생:", error);
    return false;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { getUserByEmail, getUserById, setNewUser };

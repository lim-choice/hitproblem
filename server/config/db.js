const mysql = require("mysql2/promise");
const {
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_PORT,
} = require("./dotenvConfig");

// 커넥션 풀 설정
const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    port: DB_PORT,
    waitForConnections: true,
    connectionLimit: 10, // ✅ 최대 10개의 연결 유지
    queueLimit: 0,
    connectTimeout: 10000, // ✅ 10초 동안 연결을 시도 (MySQL 서버와 연결하는 시간)
    multipleStatements: false, // ✅ SQL 인젝션 방지 (다중 쿼리 비활성화)
  });

// DB 연결 확인 함수 (서버 시작 시 실행)
const checkDBConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL 연결 성공!");
    connection.release();
  } catch (error) {
    console.error("❌ MySQL 연결 실패:", error);
    process.exit(1); // 서버 종료
  }
};

checkDBConnection(); // 서버 시작 시 DB 연결 확인

module.exports = pool;

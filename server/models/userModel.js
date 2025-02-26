const mysql = require("mysql2/promise");
const {
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_PORT,
} = require("../config/dotenvConfig");

const tableName = "users";

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port: DB_PORT, // MySQL 포트 설정
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const getUserByEmail = async (email) => {
  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

const setNewUser = async (email, password, nick) => {
  try {
    await pool.execute(
      "INSERT INTO users (email, password, nick) VALUES (?, ?, ?)",
      [email, password, nick]
    );
  } catch (ex) {
    console.log(ex);
    return false;
  }

  return true;
};

module.exports = { getUserByEmail, setNewUser };
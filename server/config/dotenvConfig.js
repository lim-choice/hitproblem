require("dotenv").config();

module.exports = {
  SECRET_KEY: process.env.JWT_SECRET || "default-secret-key",
  PORT: process.env.PORT || 5000,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT || 13306,
};

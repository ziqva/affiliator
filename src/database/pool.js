const mysql = require("mysql2");

function pool() {
  const args = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 3,
    insecureAuth : true,
    ssl: {
        rejectUnauthorized: false
    }
  };
  const p = mysql.createPool(args);
  return p;
}

module.exports = pool;

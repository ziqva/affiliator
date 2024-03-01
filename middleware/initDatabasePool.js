const database = require("../src/database");
const pool = database.pool();

module.exports = (req, _, next) => {
  req.dbPool = pool;
  next();
};

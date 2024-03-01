const database = require("../../src/database");

module.exports = async function registeredState(req, res) {
  const { email } = req.headers;

  const memberLengthEqualEmail = await database.query(
    req.dbPool,
    `SELECT COUNT(*) FROM affiliate_member WHERE email = '${email}'`
  );
  const registered = memberLengthEqualEmail[0]["COUNT(*)"] > 0;
  res.json({ registered });
};

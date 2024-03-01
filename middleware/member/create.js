const database = require("../../src/database");
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId();
const moment = require("moment-timezone");

const create = async (req, res, next) => {
  const { email } = req.headers;
  const resultData = await database.query(
    req.dbPool,
    `SELECT COUNT(*) FROM affiliate_member WHERE email = "${email}"`
  );

  const registered = resultData[0]["COUNT(*)"] > 0;
  if (registered) {
    // If already registered
    return send_res(res, true, "Anda telah terdaftar sebelumnya");
  }

  const userId = uid.stamp(60);
  database.query(
    req.dbPool,
    `INSERT INTO affiliate_member(id, created, email, unix, kupon, kupon_decrease_value, kupon_income_idr, payout_bank_name, payout_no_rek, payout_name) VALUES(
    null,
    ${moment().tz("Asia/Jakarta").unix()},
    "${email}",
    "${userId}",
    null,
    20,
    15,
    null,
    null,
    null
  )`
  );

  return res.send({
    error: false,
    message: "Selamat, kamu telah terdaftar sebagai affiliator",
    userId: userId,
  });
};

const send_res = (res, error, message) =>
  res.send({
    error,
    message,
  });

module.exports = create;

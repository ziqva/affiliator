const database = require("../../src/database");
const moment = require("moment-timezone");

const defaultTimeZone = "Asia/Jakarta";

async function main(req, res) {
  const { email } = req.headers;

  //   Get epoch`s data
  const last30DaysMoment = moment().tz(defaultTimeZone).subtract(30, "days");
  const currentMoment = moment().tz(defaultTimeZone);
  const fromEpoch = last30DaysMoment.unix();
  const toEpoch = currentMoment.unix();

  const selectorSql = `SELECT COUNT(*) FROM affiliate_transaksi WHERE affiliator_email = '${email}' AND (created_at BETWEEN ${fromEpoch} AND ${toEpoch})`;
  const resultData = await database.query(req.dbPool, selectorSql);

  const transactionCount = resultData[0]["COUNT(*)"];
  res.send({ transactionCount });
}

module.exports = main;

const database = require("../src/database");
const faker = require("faker");
const moment = require("moment-timezone");

const maxData = 300;
const pool = database.pool();
module.exports = async function payouts() {
  for (var i = 0; i < maxData; i++) {
    const epoch = moment().tz("Asia/Jakarta").unix();
    const email = "asdsada";
    const incomes = await getIncomes(email, pool);
    const insertSql = `
   INSERT INTO affiliate_payouts VALUES (
      null,
      ${epoch},
      '${email}',
      'Fiko942',
      'Ini adalah catatan',
      ${incomes}
   )
  `;

    await database.query(pool, insertSql);
    console.log(i + 1, " has been manipulated");
  }
  pool.end();
};

const getIncomes = async (email, pool) => {
  const searchSql = `SELECT affiliate_income FROM affiliate_transaksi WHERE already_paid = 0 AND affiliator_email = '${email}'`;
  var income = 0;
  const res = await database.query(pool, searchSql);
  for (var r of res) {
    income += r["affiliate_income"];
  }
  return income;
};

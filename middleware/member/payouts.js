const database = require("../../src/database");
const rupiah = require("../../src/util/rupiah");
const moment = require("moment-timezone");
require("moment/locale/id");

const epochToDate = (epoch) =>
  moment(epoch * 1000)
    .tz("Asia/Jakarta")
    .format("dddd, DD MM YYYY");

module.exports = async function payouts(req, res) {
  const { email } = req.headers;
  const resultData = await database.query(
    req.dbPool,
    `SELECT * FROM affiliate_payouts WHERE affiliate_email = '${email}' ORDER BY id DESC`
  );

  var data = [];
  for (var row of resultData) {
    data.push({
      paidAt: {
        str: epochToDate(row["created"]),
        num: row["created"],
      },
      note: row["note"],
      amount: {
        num: row["amount"],
        str: rupiah(row["amount"], "Rp."),
      },
    });
  }

  res.send(data);
};

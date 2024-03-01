const database = require("../../src/database");
const moment = require("moment-timezone");
const defaultTimezone = "Asia/Jakarta";
const rupiah = require("../../src/util/rupiah");

const getFormattedDate = (epoch) =>
  moment(epoch * 1000)
    .tz(defaultTimezone)
    .format("DD MMMM YYYY");

async function transactions(req, res) {
  const { email } = req.headers;
  const resultData = await database.query(
    req.dbPool,
    `SELECT * FROM affiliate_transaksi WHERE affiliator_email = '${email}' ORDER BY id DESC`
  );

  var data = [];
  for (var row of resultData) {
    data.push({
      product: {
        name: row["product_name"],
      },
      created: {
        str: getFormattedDate(row["created_at"]),
        epoch: row["created_at"],
      },
      affiliateIncome: {
        num: row["affiliate_income"],
        str: rupiah(row["affiliate_income"], "Rp."),
      },
      alreadyPaid: row["already_paid"] == 1,
      paidAt: {
        str: getFormattedDate(row["paid_at"]),
        num: row["paid_at"],
      },
      invoice: row["invoice_code"],
      customer: {
        email: row["customer_email"],
        name: row["customer_name"],
        paidPrice: row["customer_paid_price"],
        paidPriceStr: rupiah(row["customer_paid_price"], "Rp."),
      },
    });
  }
  res.send(data);
}

module.exports = transactions;

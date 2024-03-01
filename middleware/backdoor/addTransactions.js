const database = require("../../src/database");
const moment = require("moment-timezone");
const percentageValue = require("../../src/util/percentageValue");

const defaultTimezone = "Asia/Jakarta";

module.exports = async function addTransactions(req, res) {
  const productName = req.body.productName || "";
  const affiliatorEmail = req.body.affiliatorEmail || "";
  const customerEmail = req.body.customerEmail || "";
  const customerName = req.body.customerName || "";
  const customerPaidPrice = req.body.customerPaidPrice || "";
  const invoice = req.body.invoice || "";

  const currentMoment = moment().tz(defaultTimezone);
  //   Get percentage affiliator bonus
  var percentageAffiliateBonus = 0;
  const selectMembers = `SELECT kupon_income_idr FROM affiliate_member WHERE email = '${affiliatorEmail}'`;
  const members = await database.query(req.dbPool, selectMembers);
  if (members.length > 0) {
    const member = members[0];
    percentageAffiliateBonus = parseInt(member["kupon_income_idr"]);
  }

  //   tambahkan data
  const sql = `
   INSERT INTO affiliate_transaksi (id, product_name, created_at, affiliate_income, tanggal, bulan, tahun, invoice_code, already_paid, paid_at, affiliator_email, customer_email, customer_name, customer_paid_price) VALUES(
      null,
      '${productName}',
      ${currentMoment.unix()},
      ${percentageValue(customerPaidPrice, percentageAffiliateBonus)},
      ${currentMoment.get("date")},
      ${currentMoment.get("month")},
      ${currentMoment.get("year")},
      '${invoice}',
      0,
      null,
      '${affiliatorEmail}',
      '${customerEmail}',
      '${customerName}',
      ${customerPaidPrice}
   )
`;

  await database.query(req.dbPool, sql);
  res.send("ok");
};

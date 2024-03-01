const database = require("../../src/database");

module.exports = async function payoutMethod(req, res) {
  const { email } = req.headers;
  const resultData = await database.query(
    req.dbPool,
    `SELECT payout_bank_name, payout_name, payout_no_rek FROM affiliate_member WHERE email = '${email}'`
  );
  var data = {
    rekening: "",
    bank: "",
    name: "",
  };

  if (resultData.length > 0) {
    const x = resultData[0];
    data.rekening = x["payout_no_rek"];
    data.bank = x["payout_bank_name"];
    data.name = x["payout_name"];
  }

  res.send(data);
};

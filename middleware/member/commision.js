const database = require("../../src/database");
const rupiah = require("../../src/util/rupiah");

async function commision(req, res) {
  const { email } = req.headers;

  var commisionCount = 0;
  const resultDataCommisionCount = await database.query(
    req.dbPool,
    `SELECT affiliate_income FROM affiliate_transaksi WHERE affiliator_email = '${email}' AND already_paid = 0`
  );
  for (var result of resultDataCommisionCount) {
    commisionCount += result["affiliate_income"];
  }

  var payoutArranged = false;
  //   Cek apakah metode payout telah diubah
  const memberDataResults = await database.query(
    req.dbPool,
    `SELECT * FROM affiliate_member WHERE email = '${email}' AND payout_no_rek IS NOT null AND payout_bank_name IS NOT null AND payout_name IS NOT null`
  );

  payoutArranged = memberDataResults.length > 0;

  //   Get payout data
  var payout = {
    bankName: "",
    noRek: "",
    name: "",
  };

  const payoutData = await database.query(
    req.dbPool,
    `SELECT payout_bank_name, payout_no_rek, payout_name FROM affiliate_member WHERE email = '${email}'`
  );

  if (payoutData.length > 0) {
    const data = payoutData[0];
    payout.bankName = data["payout_bank_name"] || "";
    payout.noRek = data["payout_no_rek"] || "";
    payout.name = data["payout_name"] || "";
  }

  //   Format count as string
  const commisionCountStr = rupiah(commisionCount, "Rp.");
  res.send({ commisionCount, commisionCountStr, payoutArranged, payout });
}

module.exports = commision;

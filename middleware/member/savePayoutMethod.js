const database = require("../../src/database");

const rekeningValidator = (rekeningStr) => {
  console.log(rekeningStr.length);
  if (rekeningStr.length > 17 || rekeningStr.length < 10) {
    console.log("Panjang tidak sama");
    return false;
  }

  return rekeningStr.isNumber();
};

module.exports = async function savePayoutMethod(req, res) {
  const { norekening, bankname, namapemilik, email } = req.headers;
  const validRekening = rekeningValidator(norekening);
  if (!validRekening) {
    return res.send({
      error: true,
      message: "No Rekening tidak valid",
    });
  }

  //   Cek apakah nama pemilik valid
  if (namapemilik.length < 3 || namapemilik.length > 50) {
    return res.send({
      error: true,
      message: "Panjang nama pemilik harus diantara 3 dan 50",
    });
  }

  //   Ubah database
  await database.query(
    req.dbPool,
    `UPDATE affiliate_member 
SET payout_bank_name = '${bankname}',
   payout_no_rek = '${norekening}',
   payout_name = '${namapemilik}' WHERE email = '${email}'`
  );

  res.send({
    error: false,
  });
};

String.prototype.isNumber = function () {
  return /^\d+$/.test(this);
};

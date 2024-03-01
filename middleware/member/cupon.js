const database = require("../../src/database");
const rupiah = require("../../src/util/rupiah");

async function cupon(req, res) {
  const { email } = req.headers || "";

  const memberDatas = await database.query(
    req.dbPool,
    `SELECT kupon, kupon_decrease_value, kupon_income_idr FROM affiliate_member WHERE email = '${email}'`
  );

  var data = {
    decreaseValueStr: "",
    incomeIdrStr: "",
    cuponCode: "",
    fee: "",
    feeStr: "",
  };

  if (memberDatas.length > 0) {
    const result = memberDatas[0];
    data.decreaseValueStr = result["kupon_decrease_value"].toString() + "%";
    data.incomeIdrStr = rupiah(result["kupon_income_idr"], "Rp.");
    data.cuponCode = result["kupon"];
    data.feeStr = result["kupon_income_idr"] + "%";
    data.fee = result["kupon_income_idr"];
  }

  res.send(data);
}

module.exports = cupon;

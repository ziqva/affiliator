const database = require("../../src/database");
const axios = require('axios')

module.exports = async function changeVoucerCode(req, res) {
  const { email, voucercode } = req.headers;
  const sendErrorMessage = (msg) => {
    res.send({
      error: true,
      message: msg,
    });
  };

  // Validasi panjang karakter voucer
  if (voucercode < 3 || voucercode > 13) {
    return sendErrorMessage("Voucer tidak valid");
  } else {
    // Cek apakah voucer sudah digunakan
    const registeredKupons = await database.query(
      req.dbPool,
      "SELECT kupon FROM affiliate_member WHERE kupon is NOT NULL"
    );
    for (var kuponData of registeredKupons) {
      const kuponCode = kuponData["kupon"];
      if (kuponCode.trim() == voucercode.trim()) {
        return sendErrorMessage("Voucer tidak dapat digunakan");
      }
    }
  }
  if(await alreadyUsed(voucercode)) {
    return sendErrorMessage('Voucer tidak dapat digunakan')
  }

  //   Ubah kode kupon
  await database.query(
    req.dbPool,
    `UPDATE affiliate_member SET kupon = '${voucercode}' WHERE email = '${email}'`
  );
  res.send("Kode kupon telah berhasil diubah");
};



async function alreadyUsed(voucer) {
  return new Promise((resolve, reject) => {
    const url = 'https://appcenter.ziqva.com/migration/voucers'
    axios.get(url).then(({data}) => {
      const i = data.findIndex(x => x.code.toLowerCase() === voucer.toLowerCase())
      resolve(i>=0)
    }).catch(err => resolve(true))

  })
}
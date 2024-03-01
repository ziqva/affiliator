require("dotenv").config();
const database = require("../../src/database");
const moment = require("moment-timezone");
const tz = "Asia/Jakarta";
const axios = require("axios");
const rupiah = require("../../src/util/rupiah");

const { DEV } = process.env;

const epochtoDateFormat = (epoch) =>
  moment(epoch * 1000)
    .tz(tz)
    .format("dddd, DD/MM/YYYY");

const initUser = () => {
  return new Promise((resolve, reject) => {
    const base = DEV == 0 ? "https://admin.ziqva.com" : "http://localhost";
    axios
      .get(`${base}/user/all`)
      .then((response) => {
        resolve(response.data);
      })
      .catch(reject);
  });
};

const getUserName = (users, email) => {
  var name = "undefined";
  for (var user of users) {
    if (user.email == email) {
      name = user.name;
      break;
    }
  }
  return name;
};

module.exports = async function affiliators(req, res) {
  const users = await initUser();

  const getCommisionBeforePaid = async (email) => {
    var commisonunPaid = 0;
    const resultData = await database.query(
      req.dbPool,
      `SELECT affiliate_income FROM affiliate_transaksi WHERE affiliator_email = '${email}' AND already_paid = 0`
    );
    for (var row of resultData) {
      commisonunPaid += row["affiliate_income"];
    }
    return {
      commisonunPaid,
    };
  };

  const getTransactionCount = async (email) => {
    const data = await database.query(
      req.dbPool,
      `SELECT COUNT(*) FROM affiliate_transaksi WHERE affiliator_email = '${email}'`
    );
    return data[0]["COUNT(*)"];
  };

  const mainDataSql = `
      SELECT * FROM affiliate_member ORDER BY id DESC
   `;
  const data = await database.query(req.dbPool, mainDataSql);
  var temp = [];
  for (var member of data) {
    const { commisonunPaid } = await getCommisionBeforePaid(member["email"]);
    const transactionCount = await getTransactionCount(member["email"]);
    temp.push({
      id: member["id"],
      since: {
        epoch: member["created"],
        str: epochtoDateFormat(member["created"]),
      },
      unix: member["unix"],
      commision: {
        beforePaid: {
          num: commisonunPaid,
          str: rupiah(commisonunPaid, "Rp."),
        },
      },
      email: member["email"],
      name: getUserName(users, member["email"]),
      transactionCount,
      coupon: {
        code: member["kupon"],
        decrease: {
          num: member["kupon_decrease_value"],
          str: member["kupon_decrease_value"] + "%",
        },
        income: {
          num: member["kupon_income_idr"],
          str: member["kupon_income_idr"] + "%",
        },
      },
      payout: {
        bank: member["payout_bank_name"],
        noRekening: member["payout_no_rek"],
        name: member["payout_name"],
      },
    });
  }

  res.send(temp);
};

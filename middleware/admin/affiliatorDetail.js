const database = require("../../src/database");
const affiliators = require("./affiliators");
const moment = require("moment-timezone");
const rupiah = require("../../src/util/rupiah");

const tz = "Asia/Jakarta";

module.exports = async function affiliatorDetail(req, res) {
  const unix = req.body.unix || "";
  const nameEncoded = req.body.nameEncoded || "";
  var data = {};
  data.name = decodeBase64(nameEncoded);

  //   Data affiliator dari database
  const affiliators = await database.query(
    req.dbPool,
    `SELECT * FROM affiliate_member WHERE unix = '${unix}'`
  );
  if (affiliators.length > 0) {
    const affiliator = affiliators[0];
    data.registeredSince = {
      num: affiliator["created"],
      str: moment(affiliator["created"] * 1000)
        .tz(tz)
        .format("dddd, DD/MM/YYYY"),
    };
    data.email = affiliator["email"];
    data.income = await getIncomesData(data.email, req.dbPool);
    data.payout = await getDataPayout(data.email, req.dbPool);
    data.transaction = await getDataTransaction(data.email, req.dbPool);
  }

  res.send(data);
};

const getIncomesData = async (email, pool) => {
  var alreadyPaid = 0;
  var unPaid = 0;
  const data = await database.query(
    pool,
    `SELECT affiliate_income, already_paid FROM affiliate_transaksi WHERE affiliator_email = '${email}'`
  );
  for (var row of data) {
    if (row.already_paid == 1) {
      alreadyPaid += row.affiliate_income;
    } else {
      unPaid += row.affiliate_income;
    }
  }

  return {
    alreadyPaid: {
      num: alreadyPaid,
      str: rupiah(alreadyPaid, "Rp."),
    },
    total: {
      num: alreadyPaid + unPaid,
      str: rupiah(alreadyPaid + unPaid, "Rp."),
    },
    unPaid: {
      num: unPaid,
      str: rupiah(unPaid, "Rp."),
    },
  };
};

const getDataPayout = async (email, pool) => {
  const data = {};
  const payoutData = await database.query(
    pool,
    `SELECT * FROM affiliate_payouts WHERE affiliate_email = '${email}' ORDER BY id DESC`
  );

  data.list = [];
  data.count = payoutData.length;
  for (var payout of payoutData) {
    data.list.push({
      at: {
        num: payout.created,
        str: moment(payout.created * 1000)
          .tz(tz)
          .format("dddd, DD/MM/YYYY"),
      },
      note: payout.note,
      amount: {
        num: payout.amount,
        str: rupiah(payout.amount, "Rp."),
      },
    });
  }

  return data;
};

const getDataTransaction = async (email, pool) => {
  var data = {};
  var income = 0;
  const transactionsData = await database.query(
    pool,
    `SELECT * FROM affiliate_transaksi WHERE affiliator_email = '${email}' ORDER BY id DESC`
  );
  data.count = transactionsData.length;
  data.list = [];
  for (var transaction of transactionsData) {
    income += transaction.affiliate_income;
    data.list.push({
      productName: transaction.product_name,
      at: {
        num: transaction.created_at,
        str: moment(transaction.created_at * 1000)
          .tz(tz)
          .format("dddd, DD/MM/YYYY"),
      },
      income: {
        num: transaction.affiliate_income,
        str: rupiah(transaction.affiliate_income, "Rp."),
      },
      invoice: transaction.invoice_code,
      alreadyPaid: transaction.already_paid == 1,
      paidAt: {
        num: transaction.paid_at,
        str: moment(transaction.paid_at * 1000)
          .tz(tz)
          .format("dddd, DD/MM/YYYY"),
      },
      customer: {
        email: transaction.customer_email,
        name: transaction.customer_name,
      },
      paidPrice: {
        str: rupiah(transaction.customer_paid_price, "Rp."),
        num: transaction.customer_paid_price,
      },
    });
  }
  return data;
};

const decodeBase64 = (base) => {
  const buff = new Buffer(base, "base64");
  return buff.toString("ascii");
};

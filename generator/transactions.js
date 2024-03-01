require("dotenv").config();
const database = require("../src/database");
const lenData = 100;
const email = "asdsada";
const faker = require("faker/locale/id_ID");
const moment = require("moment-timezone");

const currentEpoch = moment().tz("Asia/Jakarta").unix();
const currentMoment = moment().tz("Asia/Jakarta");
const pool = database.pool();

database.query(pool, "SELECT * FROM user").then(console.log);

async function run() {
  for (var i = 0; i < lenData; i++) {
    const affiliateIncome = getRandomInt(10000, 100000);
    const tanggal = currentMoment.get("date");
    const bulan = currentMoment.get("month");
    const tahun = currentMoment.get("year");
    const alreadyPaid = Math.floor(Math.random() * 2);

    var paidAt = null;
    if (alreadyPaid == 1) {
      paidAt = currentEpoch;
    }

    const sql = `
   INSERT INTO affiliate_transaksi VALUES(
      null,
      'Keripik',
      '${currentEpoch}',
      ${affiliateIncome},
      ${tanggal},
      ${bulan},
      ${tahun},
      "Fiko942",
      ${alreadyPaid},
      ${paidAt},
      "${email}"
   )
`;

    await database.query(pool, sql);
    console.log(i + 1, " has been added");
  }
  pool.end();
}

// run();

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = run;

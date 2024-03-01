const create = require("./create");
const requireLogin = require("./requireLogin");
const changeVoucerCode = require("./changeVoucerCode");
const last30DaysStats = require("./last30DaysStats");
const commision = require("./commision");
const cupon = require("./cupon");
const transactions = require("./transactions");
const payouts = require("./payouts");
const registeredState = require("./registeredState");
const savePayoutMethod = require("./savePayoutMethod");
const payoutMethod = require("./payoutMethod");

module.exports = {
  payoutMethod,
  savePayoutMethod,
  registeredState,
  payouts,
  cupon,
  transactions,
  create,
  requireLogin,
  changeVoucerCode,
  last30DaysStats,
  commision,
};

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = 3000;
const app = express();
const { DEV } = process.env;
const bodyParser = require("body-parser");

// ~~ IMPORT MIDDLEWARES
const memberMiddleware = require("./middleware/member");
const backdoorMiddleware = require("./middleware/backdoor");
const adminMiddleware = require("./middleware/admin");

const initPoolConnection = require("./middleware/initDatabasePool");

// ~~ MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(initPoolConnection);
app.use(
  cors({
    origin: DEV == 1 ? "http://localhost" : "https://appcenter.ziqva.com",
  })
);
app.use("/member", memberMiddleware.requireLogin);
// ~~ END OF MIDDLEWARES

// ~~ MEMBER ROUTES
app.get("/member/register", memberMiddleware.create);
app.get("/member/change-voucer-code", memberMiddleware.changeVoucerCode);
app.get("/member/last-30-days-stats", memberMiddleware.last30DaysStats);
app.get("/member/commision", memberMiddleware.commision);
app.get("/member/cupon", memberMiddleware.cupon);
app.get("/member/transactions", memberMiddleware.transactions);
app.get("/member/payouts", memberMiddleware.payouts);
app.get("/member/registered-state", memberMiddleware.registeredState);
app.get("/member/save-payout-method", memberMiddleware.savePayoutMethod);
app.get("/member/payout-method", memberMiddleware.payoutMethod);
// ~~ END OF MEMBER ROUTES

// ~~ BACKDOOR ROUTES
app.post("/backdoor/transaction/add", backdoorMiddleware.addTransactions);
// ~~ END OF BACKDOOR ROUTES

// ~~ ADMIN ROUTES

// ~~ END OF ADMIN ROUTES
app.get("/admin/affiliators", adminMiddleware.affiliators);
app.post("/admin/affiliator-detail", adminMiddleware.affiliatorDetail);
// ~~ HANDLE NOT FOUND ERROR
app.use("/*", (req, res) => {
  res.send("404 Not Found").status(404);
});

app.listen(port, () =>
  console.log(`Application is listening on port: ${port}`)
);

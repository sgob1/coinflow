const router = require("express").Router();
const auth = require("../auth.js");
const users = require("../db/users.js");
const transactions = require("../db/transactions.js");
const values = require("../values.js");
const apiutils = require("./apiutils.js");

// Balance for logged user
router.get("/", async (req, res) => {
  const verifiedData = auth.checkAuth(req, res);
  if (typeof verifiedData === "undefined") return;

  try {
    const { year, month, day } = checkOptionalDateFromBody(req.body);

    let results = await transactions.findOfUser(
      verifiedData.username,
      year,
      month,
      day
    );

    const balance = computeBalanceFor(verifiedData.username, results);
    res.status(200).json(balance);
  } catch (err) {
    console.log(err);
    console.log("ERROR: Illegal date computation, invalid date fields");
    res.status(400).json({ msg: err });
    return;
  }
});

// Balance of logged user against user :id
router.get("/:id", async (req, res) => {
  const verifiedData = auth.checkAuth(req, res);
  if (typeof verifiedData === "undefined") return;

  try {
    const reqId = Number(req.params.id);
    if (isNaN(reqId)) throw `Invalid id ${req.params.id}`;

    const targetUser = await users.findOne({ id: reqId });
    if (!targetUser) throw `User with id ${reqId} not found`;

    const loggedUser = await users.findOne({ username: verifiedData.username });

    const { year, month, day } = checkOptionalDateFromBody(req.body);

    let results = await transactions.findOfUser(
      verifiedData.username,
      year,
      month,
      day
    );

    const balance = computeBalanceFor(loggedUser.username, results);
    let view = {};
    view[targetUser.username] = balance[targetUser.username];
    res.status(200).json(view);
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: err });
    return;
  }
});

// Computes balance for user. Positive values are money the user has to spend
// towards another user or by himself. The total is computed with all flows
const computeBalanceFor = function (user, transactions) {
  const scale = 2;
  let balance = {};
  balance[user] = values.bigDecimal();

  for (let transaction of transactions) {
    if (!transaction.quotas)
      throw `Missing quotas for transaction with id ${transaction.transactionId}, cannot compute balance`;
    if (transaction.author === user) {
      let transactionSubtotal = values.bigDecimal();
      for (let quota in transaction.quotas) {
        if (!balance[quota]) balance[quota] = values.bigDecimal();
        if (quota !== user) {
          balance[quota] = values.subAmount(
            balance[quota],
            values.bigDecimal(transaction.quotas[quota])
          );
          transactionSubtotal = values.addAmount(
            transactionSubtotal,
            values.bigDecimal(transaction.quotas[quota])
          );
        } else {
          transactionSubtotal = values.addAmount(
            transactionSubtotal,
            values.bigDecimal(transaction.quotas[user])
          );
        }
      }
      balance[user] = values.addAmount(
        balance[user],
        transactionSubtotal.round(scale)
      );
    } else {
      if (transaction.quotas[user]) {
        if (!balance[transaction.author])
          balance[transaction.author] = values.bigDecimal();
        balance[transaction.author] = values.addAmount(
          balance[transaction.author],
          values.bigDecimal(transaction.quotas[user]).round(scale)
        );
      }
    }
  }

  total = values.bigDecimal();
  for (let i in balance) total = values.addAmount(total, balance[i]);
  balance.total = total;
  for (let i in balance) balance[i] = balance[i].getValue();

  return balance;
};

const checkOptionalDateFromBody = function (body) {
  let year, month, day;
  year = body.year ? Number(body.year) : undefined;
  if (year && !apiutils.validYear(year))
    throw (err = { msg: "Invalid year in request body" });

  if (year) {
    month = body.month ? Number(body.month) : undefined;
    if (month && !apiutils.validMonth(month))
      throw (err = { msg: "Invalid month in request body" });

    if (month) {
      day = body.day ? Number(body.day) : undefined;
      if (day && !apiutils.validDate(year, month, day))
        throw (err = { msg: "Invalid date in request body" });
    }
  }
  return { year, month, day };
};

module.exports = router;

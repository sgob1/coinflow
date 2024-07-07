const router = require("express").Router();
const auth = require("../auth.js");
const users = require("../db/users.js");
const transactions = require("../db/transactions.js");
const MoneyValue = require("../MoneyValue.js");
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
      day,
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
      day,
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
  let balance = {};
  balance[user] = new MoneyValue();

  for (let transaction of transactions) {
    if (!transaction.quotas)
      throw `Missing quotas for transaction with id ${transaction.transactionId}, cannot compute balance`;
    if (transaction.author === user) {
      let transactionSubtotal = new MoneyValue();
      for (let quota in transaction.quotas) {
        if (!balance[quota]) balance[quota] = new MoneyValue();
        if (quota !== user) {
          balance[quota].sub(transaction.quotas[quota]);
          transactionSubtotal.add(transaction.quotas[quota]);
        } else {
          transactionSubtotal.add(transaction.quotas[user]);
        }
      }
      balance[user].add(transactionSubtotal);
    } else {
      if (transaction.quotas[user]) {
        if (!balance[transaction.author])
          balance[transaction.author] = new MoneyValue();
        balance[transaction.author].add(transaction.quotas[user]);
      }
    }
  }

  total = new MoneyValue();
  for (let i in balance) total.add(balance[i]);
  balance.total = total;
  let numBalance = {};
  for (let i in balance) numBalance[i] = balance[i].getValue();

  return numBalance;
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

const router = require("express").Router();
const auth = require("../auth.js");
const transactions = require("../db/transactions.js");
const users = require("../db/users.js");
const errors = require("../errors.js");
const apiutils = require("./apiutils.js");

// Logged user transactions
router.get("/", async (req, res) => {
  const verifiedData = auth.checkAuth(req, res);
  if (typeof verifiedData === "undefined") return;

  try {
    const results = await transactions.findOfUser(verifiedData.username);
    sendResults(results, res);
  } catch (error) {
    errors.internalServerError(error, res);
  }
});

// Logged user transactions search
router.get("/search", async (req, res) => {
  const verifiedData = auth.checkAuth(req, res);
  if (typeof verifiedData === "undefined") return;

  if (!req.query.q) {
    res.status(200).json({});
    return;
  }

  try {
    const results = await transactions.searchOfUserByDescription(
      verifiedData.username,
      req.query.q
    );
    sendResults(results, res);
  } catch (error) {
    errors.internalServerError(error, res);
  }
});

// Logged user info
router.get("/whoami", async (req, res) => {
  const verifiedData = auth.checkAuth(req, res);
  if (typeof verifiedData === "undefined") return;

  const user = await users.findOne({ username: verifiedData.username });

  if (user) {
    res.status(200).json(user);
  } else {
    let error = `ERROR: Logged user '${verifiedData.username}' requested 'whoami' but no corresponding user info has been found in database.`;
    errors.internalServerError(error, res);
  }
});

// Transaction :year/:month/:id details
router.get("/:year/:month/:id", async (req, res) => {
  const verifiedAuthData = auth.checkAuth(req, res);
  if (typeof verifiedAuthData === "undefined") return;

  const reqYear = Number(req.params.year);
  if (!apiutils.validYear(reqYear)) {
    res.status(400).json({ msg: `Invalid year ${req.params.year}` });
    return;
  }

  const reqMonth = Number(req.params.month);
  if (!apiutils.validMonth(reqMonth)) {
    res.status(400).json({ msg: `Invalid month ${req.params.month}` });
    return;
  }

  const reqId = Number(req.params.id);
  if (!apiutils.validId(reqId)) {
    res.status(400).json({ msg: `Invalid id ${req.params.id}` });
    return;
  }

  try {
    const transaction = await transactions.findOne({
      year: reqYear,
      month: reqMonth,
      transactionId: reqId,
      author: verifiedAuthData.username,
    });
    sendResults(transaction, res);
  } catch (error) {
    errors.internalServerError(error, res);
  }
});

// Logged user transactions in :year
router.get("/:year", async (req, res) => {
  const verifiedAuthData = auth.checkAuth(req, res);
  if (typeof verifiedAuthData === "undefined") return;

  const reqYear = Number(req.params.year);
  if (!apiutils.validYear(reqYear)) {
    res.status(400).json({ msg: `Invalid year ${req.params.year}` });
    return;
  }

  try {
    const results = await transactions.findOfUser(
      verifiedAuthData.username,
      reqYear
    );
    sendResults(results, res);
  } catch (error) {
    errors.internalServerError(error, res);
  }
});

// Logged user transactions in :year and :month
router.get("/:year/:month", async (req, res) => {
  const verifiedAuthData = auth.checkAuth(req, res);
  if (typeof verifiedAuthData === "undefined") return;

  const reqYear = Number(req.params.year);
  if (!apiutils.validYear(reqYear)) {
    res.status(400).json({ msg: `Invalid year ${req.params.year}` });
    return;
  }

  const reqMonth = Number(req.params.month);
  if (!apiutils.validMonth(reqMonth)) {
    res.status(400).json({ msg: `Invalid month ${req.params.month}` });
    return;
  }

  try {
    const results = await transactions.findOfUser(
      verifiedAuthData.username,
      reqYear,
      reqMonth
    );
    sendResults(results, res);
  } catch (error) {
    errors.internalServerError(error, res);
  }
});

// Creates a new transaction in :year and :month
router.post("/:year/:month", async (req, res) => {
  const verifiedAuthData = auth.checkAuth(req, res);
  if (verifiedAuthData === "undefined") return;

  const reqYear = Number(req.params.year);
  if (!apiutils.validYear(reqYear)) {
    res.status(400).json({ msg: `Invalid year ${req.params.year}` });
    return;
  }

  const reqMonth = Number(req.params.month);
  if (!apiutils.validMonth(reqMonth)) {
    res.status(400).json({ msg: `Invalid month ${req.params.month}` });
    return;
  }

  let year, month, day;
  try {
    year = Number(req.params.year);
    month = Number(req.params.month);
    day = Number(req.body.day);
    if (!apiutils.validDate(year, month, day)) {
      res.status(400).json({ msg: "Invalid date" });
      return;
    }
  } catch (err) {
    console.log(err);
    console.log("ERROR: Illegal date computation, invalid date fields");
    res.status(400).json({ msg: err });
    return;
  }

  try {
    await checkUserQuotas(req.body.quotas, verifiedAuthData.username);
  } catch (error) {
    res.status(400).json({ msg: error });
    return;
  }

  const transaction = {
    transactionId: await computeTransactionId(year, month),
    author: verifiedAuthData.username,
    year: year,
    month: month,
    day: day,
    description: req.body.description,
    category: req.body.category,
    quotas: req.body.quotas,
  };

  try {
    const result = await transactions.insertOne(transaction);
    res.status(200).json(result);
  } catch (error) {
    errors.internalServerError(error, res);
  }
});

// Edits transaction in :year/:month/:id
router.put("/:year/:month/:id", async (req, res) => {
  const verifiedAuthData = auth.checkAuth(req, res);
  if (verifiedAuthData === "undefined") return;

  const reqYear = Number(req.params.year);
  if (!apiutils.validYear(reqYear)) {
    res.status(400).json({ msg: `Invalid year ${req.params.year}` });
    return;
  }

  const reqMonth = Number(req.params.month);
  if (!apiutils.validMonth(reqMonth)) {
    res.status(400).json({ msg: `Invalid month ${req.params.month}` });
    return;
  }

  const reqId = Number(req.params.id);
  if (!apiutils.validId(reqId)) {
    res.status(400).json({ msg: `Invalid id ${req.params.id}` });
    return;
  }

  let existingTransaction;
  try {
    existingTransaction = await transactions.findOneRaw({
      year: reqYear,
      month: reqMonth,
      transactionId: reqId,
      author: verifiedAuthData.username,
    });
    if (!existingTransaction) {
      res.status(404).json({ msg: "Transaction not found" });
      return;
    }
    if (existingTransaction.author !== verifiedAuthData.username) {
      res
        .status(404)
        .json({
          msg: "Cannot update transaction, logged user is not the author",
        });
      return;
    }
  } catch (error) {
    errors.internalServerError(error, res);
  }

  let year, month, day;
  try {
    year = req.body.year ? Number(req.body.year) : existingTransaction.year;
    month = req.body.month ? Number(req.body.month) : existingTransaction.month;
    day = req.body.day ? Number(req.body.day) : existingTransaction.day;
    if (!apiutils.validDate(year, month, day)) {
      res.status(400).json({ msg: "Invalid date in request body" });
      return;
    }
  } catch (err) {
    console.log(err);
    console.log("ERROR: Illegal date computation, invalid date fields");
    res.status(400).json({ msg: err });
    return;
  }

  try {
    await checkUserQuotas(req.body.quotas, verifiedAuthData.username);
  } catch (error) {
    res.status(400).json({ msg: error });
    return;
  }

  if (existingTransaction.author !== verifiedAuthData.username) {
    errors.unauthorizedAccess(req, res);
    return;
  }

  let replacementTransaction = {
    author: verifiedAuthData.username,
    year: year === undefined ? existingTransaction.year : year,
    month: month === undefined ? existingTransaction.month : month,
    day: day === undefined ? existingTransaction.day : day,
    description:
      req.body.description === undefined
        ? existingTransaction.description
        : req.body.description,
    category:
      req.body.category === undefined
        ? existingTransaction.category
        : req.body.category,
    quotas:
      req.body.quotas === undefined
        ? existingTransaction.quotas
        : req.body.quotas,
  };

  if (
    replacementTransaction.year !== existingTransaction.year ||
    replacementTransaction.month !== existingTransaction.month
  ) {
    replacementTransaction.transactionId = await computeTransactionId(
      replacementTransaction.year,
      replacementTransaction.month
    );
  } else {
    replacementTransaction.transactionId = existingTransaction.transactionId;
  }

  // Internally, the transaction gets atomically replaced by the new one with
  // the provided modifications. This is done so that in any case transactions
  // are conceptually immutable and in-place updates will result, in practice,
  // in a new transaction with a new unique _id field in the database. Actual
  // transactionId field may be recycled, if the year, month and id of the two
  // transactions match.
  try {
    const replacementResult = await transactions.replaceOne(
      existingTransaction,
      replacementTransaction
    );
    res.status(200).json(replacementResult);
  } catch (error) {
    errors.internalServerError(error, res);
  }
});

// Deletes transaction in :year/:month/:id
router.delete("/:year/:month/:id", async (req, res) => {
  const verifiedAuthData = auth.checkAuth(req, res);
  if (verifiedAuthData === "undefined") return;

  const reqYear = Number(req.params.year);
  if (!apiutils.validYear(reqYear)) {
    res.status(400).json({ msg: `Invalid year ${req.params.year}` });
    return;
  }

  const reqMonth = Number(req.params.month);
  if (!apiutils.validMonth(reqMonth)) {
    res.status(400).json({ msg: `Invalid month ${req.params.month}` });
    return;
  }

  const reqId = Number(req.params.id);
  if (!apiutils.validId(reqId)) {
    res.status(400).json({ msg: `Invalid id ${req.params.id}` });
    return;
  }

  try {
    const toDelete = await transactions.findOneRaw({
      year: reqYear,
      month: reqMonth,
      transactionId: reqId,
      author: verifiedAuthData.username,
    });

    if (!toDelete) {
      res.status(404).json({ msg: "Transaction not found" });
      return;
    }

    const deletionResults = await transactions.deleteOne(toDelete);
    res.status(200).json(deletionResults);
  } catch (err) {
    errors.internalServerError(err, res);
  }
});

// Transaction ID is assigned incrementally, beginning from 0 at each month of
// the year
const computeTransactionId = async function (year, month) {
  const lastTransaction = await transactions.lastTransaction(year, month);
  return lastTransaction?.transactionId !== undefined
    ? lastTransaction.transactionId + 1
    : 0;
};

const sendResults = function (results, res) {
  if (results) {
    res.status(200).json(results);
  } else {
    res.status(404).json({ msg: "Not found" });
  }
};

const checkUserQuotas = async function (userQuotas, owner) {
  if (!userQuotas) throw "Missing quotas for submitted transaction";
  if (!userQuotas[owner]) throw `Missing owner '${owner}' from quotas`;
  try {
    for (let username in userQuotas) {
      const user = await users.findOne({ username: username });
      if (!user) throw `Cannot find username ${username}`;
      const num = Number(userQuotas[username]);
      if (isNaN(num))
        throw `Malformed ${userQuotas[username]}, cannot parse to a valid number`;
    }
  } catch (error) {
    throw "Malformed quotas in request JSON body, should be 'username: quota'";
  }
};

module.exports = router;

const router = require("express").Router();
const auth = require("../../auth.js");
const transactions = require("../../db/transactions.js");
const users = require("../../db/users.js");
const errors = require("../../errors.js");

// Logged user transactions
router.get("/", async (req, res) => {
  const verifiedData = auth.checkAuth(req, res);
  if (typeof verifiedData === "undefined") return;

  try {
    const results = await transactions.find({ author: verifiedData.username });
    sendResults(results, res);
  } catch (error) {
    errors.internalServerError(error, res);
  }
});

// TODO
router.get("/search", function (req, res) {});

// Logged user info
router.get("/whoami", async (req, res) => {
  const verifiedData = auth.checkAuth(req, res);
  if (typeof verifiedData === "undefined") return;

  const user = await users.findOne({ username: verifiedData.username });

  if (user) {
    res.status(200).json(user);
  } else {
    error = `ERROR: Logged user '${verifiedData.username}' requested 'whoami' but no corresponding user info has been found in database.`; 
    errors.internalServerError(error, res);
  }
});

// Transaction :year/:month/:id details
router.get("/:year/:month/:id", async (req, res) => {
  if (!auth.isValid(req, res)) return;

  try {
    const transaction = await transactions.findOne({
      "date.year": req.params.year,
      "date.month": req.params.month,
      transactionId: Number(req.params.id),
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

  try {
    const results = await transactions.find({
      "date.year": req.params.year,
      author: verifiedAuthData.username,
    });
    sendResults(results, res);
  } catch (error) {
    errors.internalServerError(error, res);
  }
});

// Logged user transactions in :year and :month
router.get("/:year/:month", async (req, res) => {
  const verifiedAuthData = auth.checkAuth(req, res);
  if (typeof verifiedAuthData === "undefined") return;

  try {
    const results = await transactions.find({
      "date.year": req.params.year,
      "date.month": req.params.month,
      author: verifiedAuthData.username,
    });
    sendResults(results, res);
  } catch (error) {
    errors.internalServerError(error, res);
  }
});

// Creates a new transaction in :year and :month
router.post("/:year/:month", async (req, res) => {
  const verifiedAuthData = auth.checkAuth(req, res);
  if (verifiedAuthData === "undefined") return;

  const date = {
    year: req.params.year,
    month: req.params.month,
    day: req.body.day,
  };

  if (!validDate(date.year, date.month, date.day)) {
    res.status(400).json({
      msg: `Invalid date ${date.year}-${date.month}-${date.day}`,
    });
    return;
  }

  // FIXME: check input validity in server or delete this message
  const transaction = {
    transactionId: await computeTransactionId(date),
    author: verifiedAuthData.username,
    date: date,
    description: req.body.description,
    category: req.body.category,
    totalCost: req.body.totalCost,
    users: req.body.users === undefined ? {} : req.body.users,
  };

  try {
    const result = await transactions.insertOne(transaction);
    res.status(200).json(result);
  } catch (error) {
    errors.internalServerError(error, res);
  }
});

// Edits transaction in :year/:month/:id
router.put("/:year/:month/:id", function (req, res) {
  // TODO
  res.send(
    `Modifica della spesa ${req.params.id} nel mese ${req.params.month} dell’anno ${req.params.year}`
  );
});

// Deletes transaction in :year/:month/:id
router.delete("/:year/:month/:id", function (req, res) {
  // TODO
  res.send(
    `Rimozione della spesa ${req.params.id} nel mese ${req.params.month} dell’anno ${req.params.year}`
  );
});

// Transaction ID is assigned incrementally, beginning from 0 at each month of
// the year
const computeTransactionId = async function (date) {
  const lastTransaction = await transactions.lastTransaction(date);
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

const validDate = function (year, month, day) {
  return !isNaN(new Date(`${year}-${month}-${day}`));
};

module.exports = router;

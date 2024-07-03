const router = require("express").Router();
const auth = require("../../auth.js");
const db = require("../../db/dbhandler.js");
const collections = require("../../defaults.js").COLLECTIONS;
const errors = require("../../errors.js");

router.get("/", function (req, res) {
  // TODO
  res.send("Spese dell’utente loggato");
});

router.get("/search", function (req, res) {
  // TODO
});

router.get("/whoami", async (req, res) => {
  const verifiedData = auth.checkAuth(req, res);
  if (typeof verifiedData === "undefined") return;

  const user = await db.query(
    (c) => c.findOne({ username: verifiedData.username }),
    collections.users
  );

  if (user) res.status(200).json(user);
  else errors.internalServerError(_, user);
});

router.get("/:year/:month/:id", async (req, res) => {
  if (!auth.isValid(req, res)) return;

  try {
    const transaction = await findOneTransaction({
      "date.year": req.params.year,
      "date.month": req.params.month,
      transactionId: Number(req.params.id),
    });
    sendResults(transaction, res);
  } catch (error) {
    errors.internalServerError(error, res);
  }
});

router.get("/:year", async (req, res) => {
  if (!auth.isValid(req, res)) return;

  try {
    const results = await findTransactions({
      "date.year": req.params.year,
    });
    sendResults(results, res);
  } catch (error) {
    errors.internalServerError(error, res);
  }
});

router.get("/:year/:month", function (req, res) {
  // TODO
  res.send(
    `Spese dell’utente loggato relative al mese ${req.params.month} dell’anno ${req.params.year}`
  );
});

router.post("/:year/:month", async (req, res) => {
  const verifiedAuthData = auth.checkAuth(req, res);
  if (verifiedAuthData === "undefined") return;

  // FIXME: check input validity in server or delete this message
  const description = req.body.description;
  const category = req.body.category;
  const totalCost = req.body.totalCost;
  const users =
    req.body.users === "undefined" ||
    req.body.users === "" ||
    req.body.users === "null"
      ? {}
      : req.body.users;
  const date = {
    year: req.params.year,
    month: req.params.month,
    day: req.body.day,
  };
  const author = verifiedAuthData.username;
  const transactionId = await computeTransactionId(db, date);

  const transaction = {
    transactionId,
    author,
    date,
    description,
    category,
    totalCost,
    users,
  };

  try {
    const result = await db.query(
      (c) => c.insertOne(transaction),
      collections.transactions
    );
    res.status(200).json(result);
  } catch (error) {
    errors.internalServerError(error, res);
  }
});

router.put("/:year/:month/:id", function (req, res) {
  // TODO
  res.send(
    `Modifica della spesa ${req.params.id} nel mese ${req.params.month} dell’anno ${req.params.year}`
  );
});

router.delete("/:year/:month/:id", function (req, res) {
  // TODO
  res.send(
    `Rimozione della spesa ${req.params.id} nel mese ${req.params.month} dell’anno ${req.params.year}`
  );
});

// Transaction ID is assigned incrementally, beginning from 0 at each month of
// the year
const computeTransactionId = async function (db, date) {
  const lastTransaction = await db.query(
    (c) =>
      c.findOne(
        { "date.year": date.year, "date.month": date.month },
        { sort: { transactionId: -1 } }
      ),
    collections.transactions
  );
  return lastTransaction?.transactionId !== undefined
    ? lastTransaction.transactionId + 1
    : 0;
};

const findOneTransaction = async function (query, res) {
  return await db.query((c) => c.findOne(query), collections.transactions);
};

const findTransactions = async function (query, res) {
  const findCursor = await db.query(
    (c) => c.find(query),
    collections.transactions
  );
  return await findCursor.toArray();
};

const sendResults = function (results, res) {
  if (results) {
    res.status(200).json(results);
  } else {
    res.status(404).json({ msg: "Not found" });
  }
};

module.exports = router;

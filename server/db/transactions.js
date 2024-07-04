const db = require("./dbhandler.js");
const trans = require("../defaults.js").COLLECTIONS.transactions;

const findOne = async function (query) {
  return await db.query((c) => c.findOne(query), trans);
};

const find = async function (query) {
  const findCursor = await db.query((c) => c.find(query), trans);
  return await findCursor.toArray();
};

const insertOne = async function (transaction) {
  return await db.query((c) => c.insertOne(transaction), trans);
};

const lastTransaction = async function (date) {
  return await db.query(
    (c) =>
      c.findOne(
        { "date.year": date.year, "date.month": date.month },
        { sort: { transactionId: -1 } }
      ),
    trans
  );
};

module.exports = {
  findOne,
  find,
  insertOne,
  lastTransaction,
};

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

const deleteOne = async function (transaction) {
  return await db.query((c) => c.deleteOne({ _id: transaction._id }), trans);
};

const replaceOne = async function (toReplace, replacement) {
  const filter = { _id: toReplace._id };
  return await db.query((c) => c.replaceOne(filter, replacement), trans);
};

module.exports = {
  findOne,
  find,
  insertOne,
  lastTransaction,
  deleteOne,
  replaceOne,
};

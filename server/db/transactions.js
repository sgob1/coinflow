const db = require("./dbhandler.js");
const trans = require("../defaults.js").COLLECTIONS.transactions;
const dbutils = require("./dbutils.js");

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

const findOfUser = async function (username, year, month) {
  // Composes a base query which will find all transactions owned by the user
  // and in which the user appears. To prevent duplicates, the second OR'ed
  // query excludes the first with respect to the author. Optional year and
  // month can be added to the search.
  let baseQuery = {
    $or: [
      { author: username },
      {
        ["users" + "." + username]: { $exists: true },
        author: { $ne: username },
      },
    ],
  };

  if (year) {
    baseQuery.$or[0]["date.year"] = year;
    baseQuery.$or[1]["date.year"] = year;
  }

  if (month) {
    baseQuery.$or[0]["date.month"] = month;
    baseQuery.$or[1]["date.month"] = month;
  }

  const findCursor = await db.query(
    (c) =>
      c.find(baseQuery, {
        sort: {
          "date.year": -1,
          "date.month": -1,
          "date.day": -1,
          transactionId: -1,
        },
      }),
    trans
  );
  return await findCursor.toArray();
};

const searchOfUserByDescription = async function (username, query) {
  // Composes a base query which will find all transactions owned by the user,
  // in which the user appears and with the specified query as regex. To prevent
  // duplicates, the second OR'ed query excludes the first with respect to the
  // author. Optional year and month can be added to the search.

  // Ignore case is enabled only in case of pure-letters and lowercase query
  const smartCase =
    dbutils.isalnum(query) && dbutils.isLowerCase(query) ? "i" : "";

  let baseQuery = {
    $or: [
      { author: username, description: { $regex: query, $options: smartCase } },
      {
        ["users" + "." + username]: { $exists: true },
        description: { $regex: query },
        author: { $ne: username },
      },
    ],
  };

  const findCursor = await db.query(
    (c) =>
      c.find(baseQuery, {
        sort: {
          "date.year": -1,
          "date.month": -1,
          "date.day": -1,
          transactionId: -1,
        },
      }),
    trans
  );
  return await findCursor.toArray();
};

module.exports = {
  findOne,
  find,
  insertOne,
  lastTransaction,
  deleteOne,
  replaceOne,
  findOfUser,
  searchOfUserByDescription,
};

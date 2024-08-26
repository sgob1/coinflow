const db = require("./dbhandler.js");
const trans = require("../defaults.js").COLLECTIONS.transactions;
const dbutils = require("./dbutils.js");
const projection = {
  _id: 0,
};

const findOne = async function (query) {
  return await db.query(
    (c) => c.findOne(query, { projection: projection }),
    trans,
  );
};

const findOneRaw = async function (query) {
  return await db.query((c) => c.findOne(query), trans);
};

const find = async function (query) {
  const findCursor = await db.query(
    (c) => c.find(query).project(projection),
    trans,
  );
  return await findCursor.toArray();
};

const insertOne = async function (transaction) {
  return await db.query((c) => c.insertOne(transaction), trans);
};

const lastTransaction = async function (year, month) {
  const findCursor = await db.query(
    (c) =>
      c
        .find({ year: year, month: month })
        .project(projection)
        .sort({ transactionId: -1 }),
    trans,
  );
  let array = await findCursor.toArray();
  return array[0];
};

const deleteOne = async function (transaction) {
  return await db.query((c) => c.deleteOne({ _id: transaction._id }), trans);
};

const replaceOne = async function (toReplace, replacement) {
  return await db.query(
    (c) => c.replaceOne({ _id: toReplace._id }, replacement),
    trans,
  );
};

const findOfUser = async function (username, year, month, day) {
  // Composes a base query which will find all transactions owned by the user
  // and in which the user appears. To prevent duplicates, the second OR'ed
  // query excludes the first with respect to the author. Optional year and
  // month can be added to the search.
  let baseQuery = {
    $or: [
      { author: username },
      {
        ["quotas" + "." + username]: { $exists: true },
        author: { $ne: username },
      },
    ],
  };

  if (year) {
    baseQuery.$or[0]["year"] = year;
    baseQuery.$or[1]["year"] = year;
  }

  if (month) {
    baseQuery.$or[0]["month"] = month;
    baseQuery.$or[1]["month"] = month;
  }

  if (day) {
    baseQuery.$or[0]["day"] = day;
    baseQuery.$or[1]["day"] = day;
  }

  const findCursor = await db.query(
    (c) =>
      c
        .find(baseQuery, {
          sort: {
            year: -1,
            month: -1,
            day: -1,
            transactionId: -1,
          },
        })
        .project(projection),
    trans,
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
        ["quotas" + "." + username]: { $exists: true },
        description: { $regex: query, $options: smartCase },
        author: { $ne: username },
      },
    ],
  };

  const findCursor = await db.query(
    (c) =>
      c
        .find(baseQuery, {
          sort: {
            year: -1,
            month: -1,
            day: -1,
            transactionId: -1,
          },
        })
        .project(projection),
    trans,
  );
  return await findCursor.toArray();
};

const removeAll = async function () {
  return await db.query((c) => c.deleteMany({}), trans);
};

module.exports = {
  findOne,
  findOneRaw,
  find,
  insertOne,
  lastTransaction,
  deleteOne,
  replaceOne,
  findOfUser,
  searchOfUserByDescription,
  removeAll,
};

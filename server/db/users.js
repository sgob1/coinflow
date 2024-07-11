const db = require("./dbhandler.js");
const users = require("../defaults.js").COLLECTIONS.users;
const dbutils = require("./dbutils.js");
const projection = {
  _id: 0,
  passwordHash: 0,
};

const findOne = async function (query) {
  const user = await db.query(
    (c) => c.findOne(query, { projection: projection }),
    users
  );
  return user;
};

const find = async function (query) {
  const findCursor = await db.query(
    (c) => c.find(query)?.project(projection),
    users
  );
  return await findCursor.toArray();
};

const insertOne = async function (user) {
  return await db.query((c) => c.insertOne(user), users);
};

const lastUser = async function () {
  return await db.query(
    (c) => c.findOne({}, { projection: projection }, { sort: { id: -1 } }),
    users
  );
};

const removeAll = async function () {
  return await db.query((c) => c.deleteMany({}), users);
};

const list = async function () {
  const userListCursor = await db.query(
    (c) => c.find({})?.project(projection),
    users
  );
  return userListCursor.toArray();
};

const search = async function (query) {
  // Ignore case is enabled only in case of pure-letters and lowercase query
  const smartCase =
    dbutils.isalnum(query) && dbutils.isLowerCase(query) ? "i" : "";

  let userQuery = {
    $or: [
      { username: { $regex: query, $options: smartCase } },
      { name: { $regex: query, $options: smartCase } },
      { surname: { $regex: query, $options: smartCase } },
    ],
  };
  const findCursor = await db.query(
    (c) =>
      c
        .find(userQuery, {
          sort: {
            username: -1,
          },
        })
        ?.project(projection),
    users
  );
  return await findCursor.toArray();
};

const findPassword = async function (query) {
  const user = await db.query(
    (c) =>
      c.findOne(query, {
        projection: { name: 0, surname: 0, _id: 0 },
      }),
    users
  );
  return user;
};

module.exports = {
  findOne,
  find,
  insertOne,
  lastUser,
  removeAll,
  list,
  search,
  findPassword,
};

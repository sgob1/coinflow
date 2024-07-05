const db = require("./dbhandler.js");
const users = require("../defaults.js").COLLECTIONS.users;

const findOne = async function (query) {
  return await db.query((c) => c.findOne(query), users);
};

const insertOne = async function (user) {
  return await db.query((c) => c.insertOne(user), users);
};

const lastUser = async function () {
  return await db.query((c) => c.findOne({}, { sort: { id: -1 } }), users);
};

const removeAll = async function () {
  return await db.query((c) => c.deleteMany({}), users);
};

const list = async function () {
  const userListCursor = await db.query((c) => c.find({}), users);
  return userListCursor.toArray();
};

module.exports = {
  findOne,
  insertOne,
  lastUser,
  removeAll,
  list,
};

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

module.exports = {
  findOne,
  insertOne,
  lastUser,
};

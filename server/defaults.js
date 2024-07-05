const EXPRESS_PORT = "3000";
const MONGODB_ADDR = "127.0.0.1";
const MONGODB_PORT = "27017";
const MONGODB_NAME = "coinflow";
const NOAUTH = false;
const RESET_DB = false;
const COLLECTIONS = {
  users: "users",
  transactions: "trans",
};

module.exports = {
  EXPRESS_PORT,
  MONGODB_ADDR,
  MONGODB_PORT,
  MONGODB_NAME,
  NOAUTH,
  RESET_DB,
  COLLECTIONS,
};

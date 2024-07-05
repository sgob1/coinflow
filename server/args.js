const parseArgs = require("node:util").parseArgs;
const defaults = require("./defaults.js");

const ARGS_MAP = {
  options: {
    "express-port": {
      type: "string",
      short: "P",
      default: defaults.EXPRESS_PORT,
    },
    "mongodb-addr": {
      type: "string",
      short: "a",
      default: defaults.MONGODB_ADDR,
    },
    "mongodb-port": {
      type: "string",
      short: "p",
      default: defaults.MONGODB_PORT,
    },
    dbname: {
      type: "string",
      short: "n",
      default: defaults.MONGODB_NAME,
    },
    noauth: {
      type: "boolean",
      default: defaults.NOAUTH,
    },
    "reset-db": {
      type: "boolean",
      default: defaults.RESET_DB,
    },
  },
};

let cachedArgs = undefined;

const parse = function () {
  if (!cachedArgs) {
    cachedArgs = parseArgs(ARGS_MAP);
  }
  // Returns clone so that any modification to parse() return object will not be
  // visible on further calls to parse()
  // This is to prevent accidental modifications of parsed arguments
  return structuredClone(cachedArgs.values);
};

module.exports = {
  parse,
};

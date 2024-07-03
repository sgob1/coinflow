const parseArgs = require("node:util").parseArgs;

const ARGS_MAP = {
  options: {
    "express-port": {
      type: "string",
      short: "P",
      default: "3000",
    },
    "mongodb-addr": {
      type: "string",
      short: "a",
      default: "127.0.0.1",
    },
    "mongodb-port": {
      type: "string",
      short: "p",
      default: "27017",
    },
    dbname: {
      type: "string",
      short: "n",
      default: "coinflow",
    },
    "noauth": {
      type: "boolean",
      default: false,
    }
  },
};

let cachedArgs = undefined;

const parse = function () {
  if (!cachedArgs) {
    cachedArgs = parseArgs(ARGS_MAP);
  }
  // Returns clone so that any modification to parse() return object will not be
  // visible on further calls to parse()
  // This is fundamental to avoid accidental modifications of parsed arguments
  return structuredClone(cachedArgs.values);
};

module.exports = {
  parse,
};

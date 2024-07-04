const MONGODB_URI_SCHEME = "mongodb://";
const usersDb = require("./users.js");

let uriComposer = function (addr, port, dbname) {
  return `${MONGODB_URI_SCHEME}${addr}:${port}/${dbname}`;
};

const isalnum = function (str) {
  let len = str.length;

  for (let i = 0; i < len; i++) {
    let code = str.charCodeAt(i);
    if (
      !(code > 47 && code < 58) &&
      !(code > 64 && code < 91) &&
      !(code > 96 && code < 123)
    ) {
      return false;
    }
  }
  return true;
};

const isLowerCase = function (str) {
  return str === str.toLowerCase() && str !== str.toUpperCase();
};

module.exports = {
  uriComposer,
  isalnum,
  isLowerCase,
};

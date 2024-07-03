const MONGODB_URI_SCHEME = "mongodb://";

let uriComposer = function (addr, port, dbname) {
  return `${MONGODB_URI_SCHEME}${addr}:${port}/${dbname}`;
};

module.exports = {
  uriComposer,
};

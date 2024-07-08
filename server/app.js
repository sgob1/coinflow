const express = require("express");
const api = require("./api/api.js");
const db = require("./db/dbhandler.js");
const resetDb = require("./db/init.js");
const cookieParserMiddleware = require("cookie-parser");
const args = require("./args.js");

const opt = args.parse();
const app = express();

async function startup() {
  setupKillSignalsListener(() => db.closeConnection());

  if (opt["reset-db"]) {
    await resetDb();
    process.exit(0);
  }

  app.use(requestLoggerMiddleware);
  app.use(cookieParserMiddleware());
  app.use(express.json());

  app.use(express.static(`${__dirname}/dist`));
  app.use("/api", api);

  const expressPort = opt["express-port"];
  app.listen(expressPort, () => {
    console.log(`Listening on port ${expressPort}`);
  });
}

async function main() {
  await startup();
}
// FIXME: fix or delete
let handleMalformedParamMiddleware = function (err, req) {
  if (err instanceof URIError) {
    err.message = `Failed to decode param: ${req.url}`;
    err.status = err.statusCode = 400;
  }
};

let setupKillSignalsListener = function (onQuit) {
  // https://stackoverflow.com/questions/71779732/closing-mongoclient-connection-on-exit-when-using-mongodb-native-driver
  [
    "SIGHUP",
    "SIGINT",
    "SIGQUIT",
    "SIGILL",
    "SIGTRAP",
    "SIGABRT",
    "SIGBUS",
    "SIGFPE",
    "SIGUSR1",
    "SIGSEGV",
    "SIGUSR2",
    "SIGTERM",
  ].forEach(function (signal) {
    process.on(signal, function () {
      onQuit();
      process.exit(1);
    });
  });
};

let requestLoggerMiddleware = function (req, res, next) {
  console.log(
    `Receiving ${req.method} request '${req.baseUrl}${req.url}' from ${
      req.ip === "::1" ? "localhost" : "address " + req.ip
    }`
  );
  next();
};

main();

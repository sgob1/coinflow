const express = require("express");
const path = require("path");
const api = require("./api/api.js");
const db = require("./db/dbhandler.js");
const { initDb } = require("./db/init.js");
const cookieParserMiddleware = require("cookie-parser");
const args = require("./args.js");

const opt = args.parse();
const app = express();

async function startup() {
  console.log(opt);

  setupKillSignalsListener(() => db.closeConnection());

  app.use(requestLoggerMiddleware);
  app.use(cookieParserMiddleware());
  app.use(redirectToIndexMiddleware);
  app.use(express.json());

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

let redirectToIndexMiddleware = function (req, res, next) {
  if (req.path.startsWith("/api")) {
    next();
  } else {
    res.sendFile(path.join(__dirname, "..", "client/dist", "index.html"));
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

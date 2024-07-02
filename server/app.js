const express = require("express");
const path = require("path");
const api = require("./api/api.js");
const dbh = require("./db/dbhandler.js").default;
const { initDb } = require("./db/init.js");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;

async function startup() {
  const connection = await dbh.openConnection(
    dbh.DEFAULT_MONGODB_URI,
    dbh.DEFAULT_DB_NAME
  );

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
      dbh.closeConnection();
      process.exit(1);
    });
  });

  app.use(cookieParser());

  app.use(handleMalformedParamMiddleware);

  app.use(redirectToIndexMiddleware);

  app.use("/api", api);

  app.listen(EXPRESS_PORT, () => {
    console.log(`Listening on port ${EXPRESS_PORT}`);
  });
}

async function main() {
  await startup();
}

let handleMalformedParamMiddleware = function (err, req, res, next) {
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

main();

const express = require("express");
const path = require("path");
const api = require("./api/api.js");
const dbh = require("./db/dbhandler.js");
const { initializeDatabase } = require("./db/init.js");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;

async function startup() {
  dbh.openConnection();

  process.on("SIGINT", async function () {
    await db_handler.closeConnection();
  });

  app.use(cookieParser());
  app.use(malformedParamMiddleware);
  app.use(noAPIRequestDispatcherMiddleware);
  app.use("/api", api);

  app.listen(EXPRESS_PORT, () => {
    console.log(`Listening on port ${EXPRESS_PORT}`);
  });
}

let malformedParamMiddleware = function (err, req, res, next) {
  if (err instanceof URIError) {
    err.message = `Failed to decode param: ${req.url}`;
    err.status = err.statusCode = 400;
  }
};

let noAPIRequestDispatcherMiddleware = function (req, res, next) {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "..", "client/dist", "index.html"));
  } else {
    next();
  }
};

async function main() {
  await startup();
}

main();
